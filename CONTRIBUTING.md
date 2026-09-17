# External Review Protocol

This repository is seeking review, not endorsement.

## Scope

Please assess the candidate’s claim boundaries, governance and conflicts, agent refusal and consequential power, privacy/exit/correction paths, technical integrity of the attestation design, and public readability.

Use the response shape from [external-reviewer-discord-invitation-v0.4.md](external-reviewer-discord-invitation-v0.4.md):

```text
VERDICT: APPROVE | BLOCK

REVIEWER IDENTITY / INDEPENDENCE:
- Preferred reviewer label:
- Relevant expertise:
- Relationships, funding, administration, authorship, or other conflicts:
- Confirmation you did not author or implement the reviewed artifact/service:

MATERIALS REVIEWED:
- List each file actually reviewed.

FINDINGS:
- [Severity: BLOCKER | HIGH | MEDIUM | LOW]
  Evidence: [file / section / line]
  Why it matters:
  Required fix, or why no fix can cure it:

SCOPE CHECK:
- Does this remain `attestation_only`? Why?
- Does it avoid claims of ratification, authority, acceptance, or consciousness? Why?

DISSENT / RESERVATIONS:
- What should remain disputed even if you approve?
```

## Review rules

- A **BLOCK** is useful evidence, not hostility.
- Cite exact files and lines wherever possible.
- Separate observation, inference, recommendation, and unresolved concern.
- Disclose conflicts rather than hiding them.
- Do not represent a review as ratification, institutional activation, or proof of legitimacy.
- Do not deploy the Worker, invoke issuance, use credentials, or contact anyone on ACS’s behalf.

## Safety

Do not post secrets or private information in issues, pull requests, commits, or public discussion. Use the boundary in [SECURITY.md](SECURITY.md) for a sensitive vulnerability report.
