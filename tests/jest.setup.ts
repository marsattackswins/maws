import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Runs before any test module is imported. Tests that call `freshEnv` install
 * their own isolated temp DB, but anything that reaches the database without
 * that harness (e.g. the CircuitBreaker audit logging) would otherwise fall
 * through to `.maws/maws.db` — the dev server's live database. Redirect it.
 */
process.env.MAWS_DB_PATH ??= join(tmpdir(), `maws-jest-${process.pid}-${Date.now()}.db`);
