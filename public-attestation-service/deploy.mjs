import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { materializeRuntimeConfig, removeRuntimeConfig } from './runtime-config.mjs';

const cwd = dirname(fileURLToPath(import.meta.url));
const databaseId = process.env.ACS_ATTESTATION_D1_ID;
const issuanceToken = process.env.ACS_ATTESTATION_ISSUANCE_TOKEN;
if (!issuanceToken || issuanceToken.length < 16) throw new Error('ACS_ATTESTATION_ISSUANCE_TOKEN must be set outside source control');
const configPath = await materializeRuntimeConfig(databaseId);
try {
  for (const [command, args, input] of [
    ['npx', ['--no-install', 'wrangler', 'd1', 'migrations', 'apply', 'acs-public-attestation', '--remote', '--config', configPath], undefined],
    ['npx', ['--no-install', 'wrangler', 'secret', 'put', 'ISSUANCE_TOKEN', '--config', configPath], issuanceToken],
  ]) {
    const result = spawnSync(command, args, { cwd, stdio: ['pipe', 'inherit', 'inherit'], input });
    if (result.status !== 0) throw new Error(`${command} failed`);
  }
  const result = spawnSync('npx', ['--no-install', 'wrangler', 'deploy', '--config', configPath], { cwd, stdio: 'inherit' });
  if (result.status !== 0) throw new Error('deploy failed');
} finally {
  await removeRuntimeConfig();
}
