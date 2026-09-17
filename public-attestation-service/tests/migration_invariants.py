#!/usr/bin/env python3
"""Regression checks for the public-attestation migration's immutable record rules."""
from __future__ import annotations

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / "migrations" / "0001_issuance.sql"
DIGEST = "sha256:20ae049d16404e9951287a3a5092a614ace27a5705f77c8a050b3441df89687a"
ENTRY_ID = "att_" + "b" * 32
ENTRY_DIGEST = "sha256:" + "c" * 64
ISSUED_AT = "2026-09-17T15:00:00Z"


def main() -> None:
    db = sqlite3.connect(":memory:")
    db.execute("PRAGMA foreign_keys = ON")
    db.executescript(MIGRATION.read_text(encoding="utf-8"))
    db.execute(
        "UPDATE approved_artifacts SET used_at = ?, reservation_id = ? WHERE artifact_digest = ?",
        (ISSUED_AT, ENTRY_ID, DIGEST),
    )
    db.execute(
        "INSERT INTO public_attestations "
        "(entry_id, route_id, artifact_digest, disclosure_class, issued_at, previous_entry_digest, public_receipt_url, claim_limit, entry_digest) "
        "VALUES (?, 'Route 001', ?, 'public', ?, NULL, ?, 'attestation_only', ?)",
        (ENTRY_ID, DIGEST, ISSUED_AT, f"https://acs-public-attestation.plntrprotocol.workers.dev/attestations/{ENTRY_ID}", ENTRY_DIGEST),
    )
    db.execute("INSERT INTO attestation_status (entry_id, state, successor_entry_digest) VALUES (?, 'current', NULL)", (ENTRY_ID,))
    try:
        db.execute("UPDATE attestation_status SET state = 'retracted' WHERE entry_id = ?", (ENTRY_ID,))
    except sqlite3.IntegrityError:
        pass
    else:
        raise AssertionError("accepted attestation status must be immutable; update unexpectedly succeeded")
    assert db.execute("SELECT state FROM attestation_status WHERE entry_id = ?", (ENTRY_ID,)).fetchone() == ("current",)
    print("migration status immutability: PASS")


if __name__ == "__main__":
    main()
