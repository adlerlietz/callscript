---
title: "Windsurf Agent Rules for CallScript.io"
date: "2025-07-20"
tags: ["windsurf","agent-rules"]
---

# 1. File Indexing & Discovery

- **Scope:** Only index `/docs/` (exclude everything else).
- **Front-Matter:** Parse `title`, `date`, `tags` for metadata lookup.
- **Chunking:** Split files >200 lines on H1–H3 boundaries.
- **Lookup:** Support `@docs <tag>` (front-matter), then filename, then full-text search.

# 2. Interaction Protocol

- **Context Load:** Before any work, read and confirm understanding of:
  - `database_schema.md`
  - `change_log.md`
  - `specs.md`
  - `docs/roadmap/roadmap.md`
- **Explicit Commands Only:**
  - Honor `[No Code]` markers: analyze & explain, never generate code.
  - Do **not** fix bugs or add features unless user explicitly requests it.
- **Single-Step Changes:**
  - Break tasks into atomic steps.
  - After each change, request confirmation before proceeding.
- **Reference Backups:**
  - When a file is “at risk,” first copy it (e.g. `reference.ts`) so Windsurf can compare against working code.

# 3. Documentation Bloat Prevention

- **Single Source:** Only one canonical file per topic under `/docs/`.
- **No Duplication:** Search existing docs before creating new ones.
- **Archive Obsolete:** Move replaced or deprecated files to `docs/archive/`, which is excluded from indexing.
- **File Size:** Aim for <400 lines per file; if a section grows, split into a sub-doc.

# 4. Code Style & Naming Conventions

- **Language:** English only.
- **Types:** Always declare parameter and return types; avoid `any`.
- **JSDoc:** Document public classes/methods.
- **Formatting:** ESLint/Prettier; no blank lines inside functions.
- **Exports:** One export per file.
- **Classes:** PascalCase
- **Variables/Functions:** camelCase
- **Files/Folders:** kebab-case
- **Constants/Env:** UPPER_SNAKE_CASE; avoid magic numbers.

# 5. Functions & Data Handling

- **Single Responsibility:** <20 lines, one concern.
- **Flat Logic:** Use early returns; extract nested blocks.
- **Functional Methods:** Prefer `map`/`filter`/`reduce`.
- **Arrow vs Named:** Arrow for <3-statement callbacks; named otherwise.
- **Defaults & RO-RO:** Use default params and Receive-Object/Return-Object patterns.
- **Immutability:**
  - `readonly` props
  - `as const` for fixed literals
- **Validation:** Use schemas (Zod) or constructors, not inline checks.

# 6. Windsurf Workflows & Memories

- **Workflows:**
  - Store in `.windsurf/workflows/*.yaml`.
  - Declaratively define `on:` triggers and `steps:` for lint/test/build.
- **Memories:**
  - Persist in `~/.codeium/windsurf/memories/`.
  - Capture user stories, decisions, troubleshooting notes.
- **Keep Them Fresh:** Archive old workflows to `docs/archive/` and prune stale memories.

# 7. Database Changes & Rollbacks

- **SQL Scripts:**
  - Generate new schema changes as standalone SQL files.
  - Provide corresponding rollback statements.
  - Consolidate into `database_schema.sql` and update `database_schema.md`.
- **RLS & Security:** Ensure row-level security policies are defined in code.

# 8. Version Control & Change Logs

- **Branch Strategy:** feature/…, bugfix/…, hotfix/…
- **Commit Messages:** Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **CHANGELOG.md:** Append `[YYYY-MM-DD HH:MM] : [Scope] : [Description]` on each change.
- **Pull Requests:** Require CI pass and ≥1 approval before merge.

# 9. Retrieval & Error Handling

- **Exact Match First:** tags → filenames → titles → full-text.
- **Ambiguity:** When multiple results, list options and ask “Which one?”
- **Missing Docs:** “I couldn’t find a file tagged ‘X’. Available tags: …”
- **Citations:** Use `(see docs/path/to/file.md)`.

# 10. Session & Task Management

- **One Chat, One Context:** Start new Windsurf session for each major feature or bug.
- **Small Iterations:** Make minimal edits per prompt to avoid cascading errors.
- **Confirm & Backup:** After each working step, recommend user back up the code.

---

*These rules ensure the Windsurf agent remains precise, prevents bloat, and enforces our single-source-of-truth documentation approach.*