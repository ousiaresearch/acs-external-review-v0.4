# Public Service Status — Review Packet v0.4

**Observed:** 2026-09-17

The public URL named in the activation material is already serving a Cloudflare Worker:

- `GET https://acs-public-attestation.plntrprotocol.workers.dev/` returned `404` with `{"error":"not_found"}`.
- `GET https://acs-public-attestation.plntrprotocol.workers.dev/internal/issue` returned `405`, `Allow: POST`, and `{"error":"method_not_allowed","allowed_methods":["POST"]}`.
- Both responses included `cache-control: no-store`, `x-content-type-options: nosniff`, and HSTS.

This verifies **deployment and public read-only boundary behavior only**. It does not establish that an attestation was issued, that any particular receipt exists, or that the v0.4 candidate was accepted, ratified, activated, or endorsed.

No public receipt URL or entry identifier is supplied by this packet. This repository makes no issuance claim. Do not invoke the internal issuance endpoint or treat this status record as authorization to do so.
