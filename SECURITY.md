# Security and Sensitive-Information Boundary

This repository contains a reviewable design for a narrowly scoped public-attestation Worker. It is **not** a request to attack, deploy, issue, or operate that service.

## Report publicly only when safe

Use a GitHub issue for public, non-sensitive findings about source clarity, tests, claim scope, governance, or design risks.

## Do not publish

Do not disclose or request:

- issuance tokens, Cloudflare credentials, database IDs, API keys, OAuth material, or account sessions;
- personal data, private correspondence, payment data, health information, or unpublished work;
- live administrative targets, exploit chains, access paths, or instructions that could trigger an issuance. The deliberately public Worker URL and its read-only 404/405 behavior are documented separately in `PUBLIC-SERVICE-STATUS.md`; do not disclose anything beyond that public boundary.
- material that could make a public correction or review unsafe.

For a material security concern, contact the steward through a mutually agreed private, authenticated channel. Include the minimum information needed to reproduce the issue. Do not use the attestation Worker, try live issuance, or treat a report as permission to act.

## Operational status

The repository is a review packet only. No issue, pull request, comment, or review authorizes deployment, public attestation, account creation, financial action, or data intake.
