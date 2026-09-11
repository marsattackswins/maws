<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Function design

- Prefer small, single-purpose functions; treat roughly 40 logical lines as a review prompt, not a hard limit.
- Review functions above roughly 80 logical lines for meaningful extraction, prioritizing responsibility, branching, hidden side effects, and testability over line count.
- Keep validation, state mutation, external I/O, audit logging, metrics, and response formatting distinct where practical in safety-sensitive modules.
- Do not introduce tiny abstractions solely to satisfy a line-count target.
