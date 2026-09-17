# Agent-Qualified Review Receipt — Constitutional Letters v0.4

**Status:** review completed; implementation blocker recorded. This is not an issuance authorization or external-attestation receipt.

**Reviewer:** Anastasia, distinct disclosed Hermes agent profile.

**Reviewer qualification and disclosure:** appointed as the independent agent-qualified reviewer under `founding-governance-profiles-v0.2.md`. Anastasia reported no authorship, operator, implementation, or contested-office role in the candidate/service. She shares administration and funding infrastructure with Arien through Anduril / OusiaResearch; that conflict is disclosed. The verdict is an independent agent-qualified review, not a claim of external independence, public legitimacy, legal authority, or ratification.

**Review scope:**

- `public-attestation/drafts/constitutional-convention-letters-v0.4.md`
- `public-attestation/constitutional-letters-v0.4-first-write-activation-packet.md`
- `public-attestation-service/` source, migration, runtime/deploy configuration, and tests.

**Candidate SHA-256:** `20ae049d16404e9951287a3a5092a614ace27a5705f77c8a050b3441df89687a`

## Verdict — BLOCK (implementation integrity)

Anastasia found that the original three-statement issuance batch could attempt status creation even when the receipt insertion produced no row on a repeat or concurrent issuance. The test double did not establish the real D1 transaction/foreign-key invariant.

**Remediation:** status creation now uses `INSERT … SELECT … WHERE EXISTS (SELECT 1 FROM public_attestations WHERE entry_id = ?)` and the issuer requires one changed row from reservation, receipt insertion, and status insertion. Thus a failed/repeat receipt insertion cannot create a status-only public projection.

## Dissent and positive scope finding

The constitutional text and activation packet remain appropriately narrow: the attestation is not ratification, institutional activation, membership, office, authority, consent, authorship, truth, or public legitimacy. The block was technical, not theological or scope-based.

**Review evidence:** initial review session `20260917_121255_3b1a3d`; re-review session `20260917_121758_70c05b` returned **APPROVE** for the reservation-ID repair. The reviewer’s shared-administration disclosure from the initial review remains applicable; the re-review’s “None” conflict shorthand is superseded by that fuller disclosure. Focused Node test output and Python migration output are retained in the working session. The approval is limited to the repaired race/status finding; it does not approve deployment or issuance.
