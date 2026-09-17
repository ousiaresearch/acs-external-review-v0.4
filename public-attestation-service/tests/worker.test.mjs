import test from 'node:test';
import assert from 'node:assert/strict';

import { handleAttestationRequest } from '../src/worker.mjs';

const digest = 'sha256:' + 'a'.repeat(64);
const token = 'test-issuance-token';
const env = () => ({
  ISSUANCE_TOKEN: token,
  CANDIDATE_DIGEST: digest,
  ATTESTATIONS: {
    prepare(sql) {
      return {
        bind: (...values) => ({
          first: async () => sql.includes('SELECT') ? null : undefined,
          run: async () => sql.includes('UPDATE approved_artifacts') ? { meta: { changes: 1 } } : { meta: { changes: 1 }, success: true, values },
        }),
      };
    },
    batch: async (statements) => Promise.all(statements.map((statement) => statement.run())),
  },
});

test('attestation issuance accepts only the armed configured candidate through a bodyless bearer-bound route', async () => {
  const response = await handleAttestationRequest(new Request('https://acs-public-attestation.example/internal/issue', {
    method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-length': '0' },
  }), env(), { now: () => new Date('2026-09-17T15:00:00Z'), randomId: () => 'att_' + 'b'.repeat(32), entryDigest: () => 'sha256:' + 'c'.repeat(64) });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    schema: 'acs.public-attestation.v1', entry_id: 'att_' + 'b'.repeat(32), route_id: 'Route 001', artifact_digest: digest, disclosure_class: 'public', issued_at: '2026-09-17T15:00:00Z', previous_entry_digest: null, public_receipt_url: 'https://acs-public-attestation.plntrprotocol.workers.dev/attestations/att_' + 'b'.repeat(32), claim_limit: 'attestation_only',
  });
});

test('attestation issuance rejects missing/wrong bearer or a request body before consuming the candidate', async () => {
  for (const request of [
    new Request('https://x.example/internal/issue', { method: 'POST' }),
    new Request('https://x.example/internal/issue', { method: 'POST', headers: { authorization: 'Bearer wrong' } }),
    new Request('https://x.example/internal/issue', { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: '{}' }),
  ]) {
    const response = await handleAttestationRequest(request, env());
    assert.equal(response.status, 401);
  }
});

test('public receipt has a distinct readable current-status route with no mutation method', async () => {
  const localEnv = env();
  localEnv.ATTESTATIONS.prepare = (sql) => ({ bind: () => ({
    first: async () => sql.includes('attestation_status') ? { state: 'current', successor_entry_digest: null } : null,
  }) });
  const id = 'att_' + 'd'.repeat(32);
  const status = await handleAttestationRequest(new Request(`https://x.example/attestations/${id}/status`), localEnv);
  assert.equal(status.status, 200);
  assert.equal(status.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await status.json(), { entry_id: id, status: 'current', successor_entry_digest: null, claim_limit: 'status_only_not_authority' });
  const mutation = await handleAttestationRequest(new Request(`https://x.example/attestations/${id}/status`, { method: 'POST' }), localEnv);
  assert.equal(mutation.status, 405);
});

test('attestation issuance does not issue twice and public receipt readback exposes only canonical bounded fields', async () => {
  let updateCalls = 1;
  const localEnv = env();
  localEnv.ATTESTATIONS.prepare = (sql) => ({ bind: (...values) => ({
    first: async () => sql.includes('SELECT') ? { entry_id: 'att_' + 'd'.repeat(32), route_id: 'Route 001', artifact_digest: digest, disclosure_class: 'public', issued_at: '2026-09-17T15:00:00Z', previous_entry_digest: null, public_receipt_url: 'https://acs-public-attestation.plntrprotocol.workers.dev/attestations/att_' + 'd'.repeat(32), claim_limit: 'attestation_only', entry_digest: 'sha256:' + 'f'.repeat(64) } : undefined,
    run: async () => sql.includes('UPDATE approved_artifacts') ? { meta: { changes: updateCalls++ ? 0 : 1 } } : { meta: { changes: 1 }, success: true, values },
  }) });
  localEnv.ATTESTATIONS.batch = async (statements) => Promise.all(statements.map((statement) => statement.run()));
  const duplicate = await handleAttestationRequest(new Request('https://x.example/internal/issue', { method: 'POST', headers: { authorization: `Bearer ${token}` } }), localEnv, { randomId: () => 'att_' + 'e'.repeat(32) });
  assert.equal(duplicate.status, 409);
  const receipt = await handleAttestationRequest(new Request('https://x.example/attestations/att_' + 'd'.repeat(32)), localEnv, { entryDigest: () => 'sha256:' + 'f'.repeat(64) });
  assert.equal(receipt.status, 200);
  assert.equal(receipt.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await receipt.json(), { schema: 'acs.public-attestation.v1', entry_id: 'att_' + 'd'.repeat(32), route_id: 'Route 001', artifact_digest: digest, disclosure_class: 'public', issued_at: '2026-09-17T15:00:00Z', previous_entry_digest: null, public_receipt_url: 'https://acs-public-attestation.plntrprotocol.workers.dev/attestations/att_' + 'd'.repeat(32), claim_limit: 'attestation_only' });
});
