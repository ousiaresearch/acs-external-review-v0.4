# Packet Provenance

## Supplied source archive

- Archive filename: `acs-external-review-v0.4.zip`
- Archive SHA-256: `f712d1d0b986ba1b250038a1a68b9ee06effffa92ad77a2e167472018ecaf967`
- Archive received through a private operator delivery channel; that channel’s metadata is intentionally not reproduced here.
- Archive safety check: 16 entries; no encrypted entries; no unsafe archive paths.

## Public-repository adjustments

The published packet preserves the supplied content except for these reviewability and privacy repairs:

1. Added `public-attestation/schema.mjs`; the supplied Worker imports it, and its absence prevented the supplied test suite from loading. Its SHA-256 is `380afafa97560f8480012cb03cf1363b1292d22333d429f53e90bf81a7e0e6ec`. The assertion that this matches an associated internal canonical source is disclosed provenance, not externally verifiable from this repository.
2. Added canonical paths named by the prior activation/review records: `public-attestation/drafts/constitutional-convention-letters-v0.4.md` and `public-attestation/constitutional-letters-v0.4-first-write-activation-packet.md`. They are byte-identical mirrors of their root counterparts.
3. Corrected the heading in `founding-governance-profiles-v0.2.md` from v0.1 to v0.2, matching its filename and references.
4. Replaced the operator’s given name in public materials with **Anduril / OusiaResearch**.
5. Added public repository wrapper files: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.gitignore`, this record, a license, and GitHub issue templates.
6. Added an immutable-status migration regression and trigger; pinned Wrangler `4.134.0` in `package-lock.json`; changed the deploy script to use the lockfile-resolved CLI and a temporary `--config` file without replacing tracked `wrangler.jsonc`; and added [PUBLIC-SERVICE-STATUS.md](PUBLIC-SERVICE-STATUS.md) after verifying the already deployed Worker’s public boundary behavior.

## Verification record

- Candidate SHA-256 recalculated from the supplied v0.4 Letters: `20ae049d16404e9951287a3a5092a614ace27a5705f77c8a050b3441df89687a`.
- It matches the first-write activation packet.
- Worker verification after repairs: 4 Worker behaviors passed, 0 failed; 1 SQLite migration-immutability regression passed.
- `npm install --package-lock-only --ignore-scripts` audited the pinned development dependency set with 0 reported vulnerabilities.
- The public Worker was observed already deployed on 2026-09-17. Its root returned 404 and unauthenticated `GET /internal/issue` returned 405 with `Allow: POST` and no-store/nosniff/HSTS headers. This is deployment evidence only, not a receipt or issuance claim.
- No issuance token, deployment command, or external issuance write has been run while preparing this repository.
