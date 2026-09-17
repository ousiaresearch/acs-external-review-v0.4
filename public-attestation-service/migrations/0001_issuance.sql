CREATE TABLE approved_artifacts (
  artifact_digest TEXT PRIMARY KEY NOT NULL CHECK (artifact_digest GLOB 'sha256:*' AND substr(artifact_digest, 8) NOT GLOB '*[^0-9a-f]*' AND length(artifact_digest) = 71),
  issuance_state TEXT NOT NULL CHECK (issuance_state = 'armed'),
  used_at TEXT CHECK (used_at IS NULL OR (length(used_at) = 20 AND substr(used_at, 12, 2) BETWEEN '00' AND '23' AND substr(used_at, 15, 2) BETWEEN '00' AND '59' AND substr(used_at, 18, 2) BETWEEN '00' AND '59' AND strftime('%Y-%m-%dT%H:%M:%SZ', used_at) = used_at)),
  reservation_id TEXT UNIQUE CHECK (reservation_id IS NULL OR (reservation_id GLOB 'att_*' AND substr(reservation_id, 5) NOT GLOB '*[^0-9a-f]*' AND length(reservation_id) = 36))
) STRICT;

INSERT INTO approved_artifacts (artifact_digest, issuance_state, used_at)
VALUES ('sha256:20ae049d16404e9951287a3a5092a614ace27a5705f77c8a050b3441df89687a', 'armed', NULL);

CREATE TABLE public_attestations (
  entry_id TEXT PRIMARY KEY NOT NULL CHECK (entry_id GLOB 'att_*' AND substr(entry_id, 5) NOT GLOB '*[^0-9a-f]*' AND length(entry_id) = 36),
  route_id TEXT NOT NULL CHECK (route_id = 'Route 001'),
  artifact_digest TEXT UNIQUE NOT NULL REFERENCES approved_artifacts(artifact_digest),
  disclosure_class TEXT NOT NULL CHECK (disclosure_class = 'public'),
  issued_at TEXT NOT NULL CHECK (length(issued_at) = 20 AND substr(issued_at, 12, 2) BETWEEN '00' AND '23' AND substr(issued_at, 15, 2) BETWEEN '00' AND '59' AND substr(issued_at, 18, 2) BETWEEN '00' AND '59' AND strftime('%Y-%m-%dT%H:%M:%SZ', issued_at) = issued_at),
  previous_entry_digest TEXT REFERENCES public_attestations(entry_digest),
  public_receipt_url TEXT NOT NULL CHECK (public_receipt_url = 'https://acs-public-attestation.plntrprotocol.workers.dev/attestations/' || entry_id),
  claim_limit TEXT NOT NULL CHECK (claim_limit = 'attestation_only'),
  entry_digest TEXT UNIQUE NOT NULL CHECK (entry_digest GLOB 'sha256:*' AND substr(entry_digest, 8) NOT GLOB '*[^0-9a-f]*' AND length(entry_digest) = 71)
) STRICT;

CREATE TABLE attestation_status (
  entry_id TEXT PRIMARY KEY NOT NULL REFERENCES public_attestations(entry_id),
  state TEXT NOT NULL CHECK (state IN ('current', 'amended', 'retracted')),
  successor_entry_digest TEXT REFERENCES public_attestations(entry_digest)
) STRICT;

CREATE TRIGGER attestation_status_no_delete BEFORE DELETE ON attestation_status
BEGIN SELECT RAISE(ABORT, 'attestation status is retained'); END;
CREATE TRIGGER attestation_status_immutable_update BEFORE UPDATE ON attestation_status
BEGIN SELECT RAISE(ABORT, 'attestation status is immutable'); END;

CREATE TRIGGER public_attestations_requires_consumed_artifact BEFORE INSERT ON public_attestations
WHEN (SELECT used_at FROM approved_artifacts WHERE artifact_digest = NEW.artifact_digest) IS NULL
BEGIN SELECT RAISE(ABORT, 'approved artifact must be consumed before attestation insertion'); END;
CREATE TRIGGER public_attestations_immutable_update BEFORE UPDATE ON public_attestations
BEGIN SELECT RAISE(ABORT, 'public attestations are append-only'); END;
CREATE TRIGGER public_attestations_immutable_delete BEFORE DELETE ON public_attestations
BEGIN SELECT RAISE(ABORT, 'public attestations are append-only'); END;
CREATE TRIGGER approved_artifacts_immutable_update BEFORE UPDATE ON approved_artifacts
WHEN OLD.used_at IS NOT NULL OR NEW.artifact_digest <> OLD.artifact_digest OR NEW.issuance_state <> OLD.issuance_state OR NEW.used_at IS NULL
BEGIN SELECT RAISE(ABORT, 'approved artifact cannot be reset or changed'); END;
CREATE TRIGGER approved_artifacts_immutable_delete BEFORE DELETE ON approved_artifacts
BEGIN SELECT RAISE(ABORT, 'approved artifacts are retained'); END;
