import { canonicalizePublicAttestation } from '../../public-attestation/schema.mjs';

const PUBLIC_BASE_URL = 'https://acs-public-attestation.plntrprotocol.workers.dev';
const RECEIPT_PATH = /^\/attestations\/(att_[a-f0-9]{32})$/;
const STATUS_PATH = /^\/attestations\/(att_[a-f0-9]{32})\/status$/;
const ISSUE_PATH = '/internal/issue';
const SHA256 = /^[0-9a-f]{64}$/;

function json(payload, init = {}) {
  return Response.json(payload, {
    ...init,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json; charset=UTF-8',
      'x-content-type-options': 'nosniff',
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      ...(init.headers ?? {}),
    },
  });
}

function noBody(request) {
  const length = request.headers.get('content-length');
  return request.body === null && (length === null || /^0+$/.test(length));
}

function authorized(request, token) {
  return typeof token === 'string' && token.length >= 16 && request.headers.get('authorization') === `Bearer ${token}`;
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${[...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

function candidateDigest(env) {
  return typeof env.CANDIDATE_DIGEST === 'string' && /^sha256:[a-f0-9]{64}$/.test(env.CANDIDATE_DIGEST) ? env.CANDIDATE_DIGEST : null;
}

function receiptPayload({ entryId, artifactDigest, issuedAt }) {
  return {
    schema: 'acs.public-attestation.v1',
    entry_id: entryId,
    route_id: 'Route 001',
    artifact_digest: artifactDigest,
    disclosure_class: 'public',
    issued_at: issuedAt,
    previous_entry_digest: null,
    public_receipt_url: `${PUBLIC_BASE_URL}/attestations/${entryId}`,
    claim_limit: 'attestation_only',
  };
}

export async function handleAttestationRequest(request, env, { now = () => new Date(), randomId = () => `att_${crypto.randomUUID().replaceAll('-', '')}`, entryDigest = sha256 } = {}) {
  const pathname = new URL(request.url).pathname;
  const statusMatch = STATUS_PATH.exec(pathname);
  if (statusMatch) {
    if (request.method !== 'GET') return json({ error: 'method_not_allowed', allowed_methods: ['GET'] }, { status: 405, headers: { allow: 'GET' } });
    try {
      const status = await env.ATTESTATIONS.prepare('SELECT state, successor_entry_digest FROM attestation_status WHERE entry_id = ?').bind(statusMatch[1]).first();
      if (!status) return json({ error: 'not_found' }, { status: 404 });
      return json({ entry_id: statusMatch[1], status: status.state, successor_entry_digest: status.successor_entry_digest, claim_limit: 'status_only_not_authority' });
    } catch { return json({ error: 'receipt_unavailable' }, { status: 503 }); }
  }
  const receiptMatch = RECEIPT_PATH.exec(pathname);
  if (receiptMatch) {
    if (request.method !== 'GET') return json({ error: 'method_not_allowed', allowed_methods: ['GET'] }, { status: 405, headers: { allow: 'GET' } });
    try {
      const row = await env.ATTESTATIONS.prepare('SELECT entry_id, route_id, artifact_digest, disclosure_class, issued_at, previous_entry_digest, public_receipt_url, claim_limit, entry_digest FROM public_attestations WHERE entry_id = ?').bind(receiptMatch[1]).first();
      if (!row) return json({ error: 'not_found' }, { status: 404 });
      const { entry_digest: persistedDigest, ...entry } = row;
      const canonical = canonicalizePublicAttestation({ schema: 'acs.public-attestation.v1', ...entry }, { receiptBaseUrl: PUBLIC_BASE_URL });
      if (!canonical || typeof persistedDigest !== 'string' || await entryDigest(canonical) !== persistedDigest) return json({ error: 'receipt_unavailable' }, { status: 503 });
      return json(JSON.parse(canonical));
    } catch {
      return json({ error: 'receipt_unavailable' }, { status: 503 });
    }
  }
  if (pathname !== ISSUE_PATH) return json({ error: 'not_found' }, { status: 404 });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed', allowed_methods: ['POST'] }, { status: 405, headers: { allow: 'POST' } });
  if (!authorized(request, env.ISSUANCE_TOKEN) || !noBody(request)) return json({ error: 'unauthorized' }, { status: 401 });
  const artifactDigest = candidateDigest(env);
  if (!artifactDigest) return json({ error: 'issuance_unavailable' }, { status: 503 });
  const entryId = randomId();
  const issuedAt = now().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const payload = receiptPayload({ entryId, artifactDigest, issuedAt });
  const canonical = canonicalizePublicAttestation(payload, { receiptBaseUrl: PUBLIC_BASE_URL });
  if (!canonical) return json({ error: 'issuance_unavailable' }, { status: 503 });
  try {
    const digest = await entryDigest(canonical);
    if (typeof digest !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(digest)) throw new Error('invalid entry digest');
    const reservation = env.ATTESTATIONS.prepare("UPDATE approved_artifacts SET used_at = ?, reservation_id = ? WHERE artifact_digest = ? AND issuance_state = 'armed' AND used_at IS NULL AND reservation_id IS NULL").bind(issuedAt, entryId, artifactDigest);
    const insertion = env.ATTESTATIONS.prepare("INSERT INTO public_attestations (entry_id, route_id, artifact_digest, disclosure_class, issued_at, previous_entry_digest, public_receipt_url, claim_limit, entry_digest) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM approved_artifacts WHERE artifact_digest = ? AND reservation_id = ?)").bind(entryId, payload.route_id, artifactDigest, payload.disclosure_class, issuedAt, null, payload.public_receipt_url, payload.claim_limit, digest, artifactDigest, entryId);
    const status = env.ATTESTATIONS.prepare("INSERT INTO attestation_status (entry_id, state, successor_entry_digest) SELECT ?, 'current', NULL WHERE EXISTS (SELECT 1 FROM public_attestations WHERE entry_id = ?)").bind(entryId, entryId);
    const [reservationResult, insertionResult, statusResult] = await env.ATTESTATIONS.batch([reservation, insertion, status]);
    if (reservationResult.meta?.changes !== 1 || insertionResult.meta?.changes !== 1 || statusResult.meta?.changes !== 1) return json({ error: 'candidate_already_issued_or_not_armed' }, { status: 409 });
  } catch {
    return json({ error: 'issuance_unavailable' }, { status: 503 });
  }
  return json(payload, { status: 201, headers: { location: payload.public_receipt_url } });
}

export default { fetch: (request, env) => handleAttestationRequest(request, env) };
