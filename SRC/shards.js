// Координатор шардов. Каждый шард — отдельный Worker (service binding) со своей D1.
// Никакого Dispatch Namespace / Workers for Platforms — просто статический список
// service bindings в wrangler.toml главного воркера + таблица `shards` в главной D1.

export async function pickShardForWrite(env, sizeBytes) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM shards WHERE active = 1 AND (used_bytes + ?) <= capacity_bytes ORDER BY used_bytes ASC LIMIT 1'
  ).bind(sizeBytes).all();

  if (results.length === 0) {
    throw new Error(
      'Все шарды заполнены. Задеплой новый shard-worker и добавь строку в таблицу `shards`.'
    );
  }
  return results[0];
}

export function getShardBinding(env, shard) {
  const binding = env[shard.binding_name];
  if (!binding) throw new Error(`Service binding ${shard.binding_name} не найден в env`);
  return binding;
}

export async function storeBlobInShard(env, shard, key, mime, base64) {
  const binding = getShardBinding(env, shard);
  const res = await binding.fetch('https://internal/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': env.INTERNAL_SECRET },
    body: JSON.stringify({ key, mime, base64 }),
  });
  if (!res.ok) throw new Error(`Ошибка записи в шард ${shard.id}: ${await res.text()}`);
  return res.json();
}

export async function fetchBlobFromShard(env, shard, key) {
  const binding = getShardBinding(env, shard);
  const res = await binding.fetch(`https://internal/fetch?key=${encodeURIComponent(key)}`, {
    headers: { 'X-Internal-Secret': env.INTERNAL_SECRET },
  });
  if (!res.ok) return null;
  return res;
}

export async function bumpShardUsage(env, shardId, deltaBytes) {
  await env.DB.prepare('UPDATE shards SET used_bytes = used_bytes + ? WHERE id = ?')
    .bind(deltaBytes, shardId).run();
}
