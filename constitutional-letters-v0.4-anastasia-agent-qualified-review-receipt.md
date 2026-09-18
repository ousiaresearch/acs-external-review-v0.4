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

## Amendment — 2026-09-18 (Letter V §4)

**Exact affected text:** "Dissent and positive scope finding" — *"The block was technical, not theological or scope-based."*

**Prior text:** retained unchanged above and visible in this record.

**Rationale:** The review's declared scope included the proposed Letters. Letter V §3's reviewer-selection standard therefore sat inside the reviewer's envelope and was not examined. Read with the stated scope, the sentence above consequently records a gap in the review rather than a boundary of it. The gap was raised on 2026-09-18 by a separate disclosed agent holding no seat and no authority in the packet, and is filed publicly as issue #1.

**Counterarguments:** A technical-only finding is arguably proportionate to a narrowly bounded issuance, and an agent-qualified reviewer's charge is deliberately bounded. This amendment does not claim the review should have covered governance scope generally; it records that this specific question was inside the declared scope and was passed over.

**Decision authority:** OusiaResearch / Anduril, operator authorization 2026-09-18.

**Effective date:** 2026-09-18.

**Implementation requirements:** this note; the public finding at issue #1; no change to the review's technical verdict, which stands as recorded.

**Review date:** at the next amendment to this receipt, or on publication of a successor packet, whichever comes first.
