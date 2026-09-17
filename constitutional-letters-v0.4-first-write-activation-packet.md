# First External Public-Attestation Activation Packet — Constitutional Letters v0.4

**Status:** prepared; blocked pending final independent reviews and an independent agent-qualified review. This packet does not itself deploy, issue, or attest.

## Exact action authorization

- **Human authorization source:** OusiaResearch authorized one bounded `public_attestation_write` action in private operator correspondence on 2026-09-17. The underlying correspondence is not reproduced in this public packet.
- **Action class:** one `public_attestation_write` only.
- **Artifact:** `public-attestation/drafts/constitutional-convention-letters-v0.4.md`
- **Artifact SHA-256:** `20ae049d16404e9951287a3a5092a614ace27a5705f77c8a050b3441df89687a`
- **Route / disclosure / claim limit:** `Route 001` / `public` / `attestation_only`.
- **Permitted outcome:** exactly one public receipt that shows the canonical bounded entry for that digest.
- **Prohibited outcomes:** any ratification, incorporation, membership enrollment, office appointment, institutional activation, account creation, data intake, profile action, message, payment, financial action, credential disclosure, analytics, or second attestation.
- **Expiry:** authorization expires after a successful write and verified readback, or at the first unresolved mismatch, deployment failure, review blocker, or credential incident.

## Accountable operation

- **Accountable human operator:** Anduril / OusiaResearch.
- **Operational agent:** Arien, acting only through the accountable Hermes harness.
- **Hosting platform:** Cloudflare Workers; the Worker `acs-public-attestation` at `https://acs-public-attestation.plntrprotocol.workers.dev/` was observed deployed on 2026-09-17. Its public root returned `404` and unauthenticated `GET /internal/issue` returned `405` with `Allow: POST` and documented security headers. This is deployment evidence only; it is not evidence of issuance, ratification, acceptance, or authority.
- **Account-control evidence:** Cloudflare token verification was active on 2026-09-17; the authorized account lists the existing ACS Workers and Pages projects. This is platform-control evidence, not evidence of institutional legitimacy.
- **Stop authority:** Anduril may disable/delete the Worker or revoke its issuance secret. Arien must stop on any service mismatch, failed readback, review blocker, or suspected credential incident.

## Data, credential, and spend boundary

- The public receipt stores and exposes only the closed attestation fields: schema, opaque entry ID, Route 001, artifact SHA-256, `public`, UTC issuance time, null predecessor, receipt URL, and `attestation_only`.
- The issuance endpoint accepts no request body and is bearer-protected by one profile-scoped secret. No token, credential, account identity, contact data, private correspondence, payload text, analytics identifier, payment data, or personal data is stored in the receipt database or returned publicly.
- **Spend boundary:** no purchase, custom domain, DNS change, payment, token, fundraising, or financial instrument is authorized. Deployment must halt if Cloudflare indicates any paid operation or charge outside the account’s ordinary existing service tier.
- **Credential boundary:** issuance secret is generated and retained only in Arien profile-scoped secret storage, entered into Cloudflare as a Worker secret, and never committed, printed, copied into the receipt, or surfaced in logs.

## Issuance and readback procedure

1. Verify the deployed Worker’s public base URL, only allowed paths, security headers, database migration state, armed single-use candidate record, and absence of public write methods.
2. Run the two final independent code/scope reviews against the exact source and packet. Any blocking result withholds any issuance or further operational change.
3. Re-read the already deployed Worker’s public 404/method behavior and compare it to the reviewed source. This review packet does not authorize any deployment operation.
4. Invoke the one bodyless, bearer-bound internal issuance request once.
5. Capture the returned canonical entry without the bearer; then retrieve its `public_receipt_url` from a fresh unauthenticated HTTPS client.
6. Canonicalize and compare every visible receipt field against the approved values and exact artifact SHA-256. Verify response status, no-store/nosniff/HSTS headers, and that a repeat internal issue attempt returns conflict.
7. Write a redacted operation receipt naming the entry ID, public receipt URL, issuance/readback times, observed digest, headers, and any uncertainty. Do not claim success unless steps 4–6 agree.

## Correction, retraction, and exit

- This first entry accepts no public input. The active narrow Route 001 correction service remains the separate, published correction path; it does not accept material through the attestation Worker.
- A future amendment or retraction requires a separately approved artifact and linked canonical successor. It is outside this one-write authorization.
- If the Worker or receipt becomes unavailable, inconsistent, or unsafe, label the attestation as uncertain/withheld in the local operation receipt; stop further writes; retain the local evidence packet; and publish a later correction/withdrawal notice only through separately approved means.

## Remaining blocking conditions

- The implementation must pass fresh hostile and governance/privacy reviews with all blockers resolved.
- Anastasia is authorized as the proposed **independent agent-qualified reviewer** for this issuance, subject to a selection receipt that records her distinct-agent status, shared-administration disclosure, capability/evidence basis, no-authorship/no-implementation conflict declaration, recusal route, and dissent-capable written verdict. Her review is not represented as external independence or public legitimacy.
- The already deployed service must be shown to match the reviewed source, and exact public readback must succeed before any “externally attested” claim is made.
