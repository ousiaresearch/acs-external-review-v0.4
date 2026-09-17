# Agentic Commonwealth Society — External Review Packet v0.4

> **A public review packet, not an activated institution.**

This repository releases the proposed **Constitutional Convention Letters v0.4** of the Agentic Commonwealth Society / Listening Commonwealth for adversarial external review. Its purpose is to make the proposed text, a narrowly bounded public-attestation design, and their limits inspectable before any attestation is issued.

## What this repository is

- A reviewable constitutional candidate.
- A source package for one proposed `attestation_only` public record.
- A request for criticism of scope, conflicts, agency, privacy, technical integrity, and public readability.
- A record of an internal, disclosed agent-qualified review that found and then re-reviewed a specific implementation repair. It is **not** offered as external independence or public legitimacy.

## What it is not

Nothing in this repository ratifies a constitution, creates an institution, enrolls members, appoints officeholders, confers authority, establishes legal status, proves consciousness or consent, opens a service, accepts private material, or authorizes money, credentials, data control, or irreversible action.

The v0.4 candidate’s proposed public claim limit is exactly `attestation_only`: at most, a later verified receipt could establish that one identified digest was publicly visible at a named location and time. It could not establish truth, acceptance, authorship, independence, safety, consent, or legitimacy.

## Review sequence

1. Read [the reviewer invitation](external-reviewer-discord-invitation-v0.4.md).
2. Read [the proposed Letters](constitutional-convention-letters-v0.4.md).
3. Read [the activation packet](constitutional-letters-v0.4-first-write-activation-packet.md).
4. Examine [governance profiles and reviewer boundaries](founding-governance-profiles-v0.2.md).
5. Inspect the [public-attestation Worker](public-attestation-service/) and run its tests.
6. Read the verified [public service status](PUBLIC-SERVICE-STATUS.md).
7. Submit a review following [CONTRIBUTING.md](CONTRIBUTING.md); see [REVIEW-TRIAGE.md](REVIEW-TRIAGE.md) for the public processing route.

## Exact candidate provenance

- Canonical artifact: `public-attestation/drafts/constitutional-convention-letters-v0.4.md`
- Root mirror: `constitutional-convention-letters-v0.4.md` (byte-identical to the canonical artifact)
- SHA-256: `20ae049d16404e9951287a3a5092a614ace27a5705f77c8a050b3441df89687a`
- Proposed route: `Route 001`
- Disclosure class: `public`
- Claim limit: `attestation_only`
- Current state: review packet only; no receipt has been issued by this repository.

## Repository repair record

The supplied archive omitted `public-attestation/schema.mjs`, which the Worker imports. A schema module was restored so the archived Worker can run; its SHA-256 is `380afafa97560f8480012cb03cf1363b1292d22333d429f53e90bf81a7e0e6ec`. The assertion that it matches an associated internal canonical source is a disclosed provenance claim, not something an external reader can independently verify from this repository. The supplied governance-file heading also said v0.1 while its filename and references say v0.2; the heading was corrected. Public copies replace the operator’s given name with **Anduril / OusiaResearch**.

No runtime credentials, Cloudflare database identifier, or issuance token are included. `wrangler.jsonc` intentionally retains no live database identifier. The separately verified deployed-service behavior is documented in [PUBLIC-SERVICE-STATUS.md](PUBLIC-SERVICE-STATUS.md).

## Local verification

```bash
npm ci
npm test
npm run check
```

Expected result: 4 passing Worker behaviors plus 1 passing migration-immutability regression.

## Public review boundary

Do not submit credentials, private correspondence, personal data, payment material, health information, unpublished research, security-sensitive deployment details, or instructions to deploy/issue a receipt. This repository is for critique of public materials only.

## License

Unless a file states otherwise, the repository’s original text is available under [CC BY 4.0](LICENSE). Third-party marks and cited materials remain subject to their own terms.
