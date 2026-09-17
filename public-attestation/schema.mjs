const HEX64 = /^[0-9a-f]{64}$/;
const ID = /^att_[0-9a-f]{32}$/;
const TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function validTimestamp(value) {
  if (typeof value !== 'string' || !TIME.test(value)) return false;
  const [date, clock] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = clock.slice(0, -1).split(':').map(Number);
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59 || second > 59) return false;
  // Mirror the storage CHECK: a format-shaped but impossible date must not be canonicalized
  // into a digest. Leap years are computed directly rather than through Date, whose
  // two-digit-year mapping would silently accept year 0000.
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= lengths[month - 1];
}

/**
 * Canonicalize one public attestation entry.
 *
 * `receiptBaseUrl` is REQUIRED: the receipt origin is what binds a digest to a specific
 * public surface, so a default would let a caller canonicalize against one host while the
 * operative service serves another. Omitting it returns null rather than guessing.
 */
export function canonicalizePublicAttestation(value, { receiptBaseUrl } = {}) {
  if (typeof receiptBaseUrl !== 'string' || !/^https:\/\/[a-z0-9.-]+$/i.test(receiptBaseUrl)) return null;
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) return null;
  const keys = ['schema', 'entry_id', 'route_id', 'artifact_digest', 'disclosure_class', 'issued_at', 'previous_entry_digest', 'public_receipt_url', 'claim_limit'];
  if (Object.keys(value).length !== keys.length || !keys.every((key) => Object.hasOwn(value, key))) return null;
  if (!keys.filter((key) => key !== 'previous_entry_digest').every((key) => typeof value[key] === 'string')) return null;
  if (value.previous_entry_digest !== null && typeof value.previous_entry_digest !== 'string') return null;
  if (value.schema !== 'acs.public-attestation.v1' || !ID.test(value.entry_id) || value.route_id !== 'Route 001' || value.disclosure_class !== 'public' || value.claim_limit !== 'attestation_only' || !validTimestamp(value.issued_at)) return null;
  if (typeof value.artifact_digest !== 'string' || !value.artifact_digest.startsWith('sha256:') || !HEX64.test(value.artifact_digest.slice(7))) return null;
  if (value.previous_entry_digest !== null && (typeof value.previous_entry_digest !== 'string' || !value.previous_entry_digest.startsWith('sha256:') || !HEX64.test(value.previous_entry_digest.slice(7)))) return null;
  const expected = `${receiptBaseUrl}/attestations/${value.entry_id}`;
  if (value.public_receipt_url !== expected) return null;
  return JSON.stringify(Object.fromEntries(keys.map((key) => [key, value[key]])));
}
