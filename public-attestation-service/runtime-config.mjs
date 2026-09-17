import { chmod, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(root, 'wrangler.jsonc');
export const runtimeConfigPath = join(root, '.wrangler.runtime.jsonc');

export function renderRuntimeConfig(databaseId, source) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(databaseId)) throw new Error('ACS_ATTESTATION_D1_ID must be a UUID');
  const config = JSON.parse(source);
  config.d1_databases[0].database_id = databaseId;
  return `${JSON.stringify(config, null, 2)}\n`;
}

export async function materializeRuntimeConfig(databaseId) {
  await rm(runtimeConfigPath, { force: true });
  const source = await readFile(sourcePath, 'utf8');
  await writeFile(runtimeConfigPath, renderRuntimeConfig(databaseId, source), { mode: 0o600 });
  await chmod(runtimeConfigPath, 0o600);
  return runtimeConfigPath;
}

export async function removeRuntimeConfig() {
  await rm(runtimeConfigPath, { force: true });
}
