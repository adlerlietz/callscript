---
title: "Phase 0 – Foundations & Tooling (Weeks 0–1)"
date: "2025-07-20"
tags: ["roadmap", "phase-0", "foundations"]
effort: "Medium"
status: "Pending"
---

# Phase 0 – Foundations & Tooling (Weeks 0–1)

This phase establishes CallScript.io’s core infrastructure, architecture, and developer workflows. It covers monorepo setup, core service definitions, data flow, authentication, database configuration on Supabase, GitHub repository maintenance, CI/CD, observability, design system scaffolding, containerization, security/compliance, quality/testing, and documentation/onboarding.

## Monorepo Structure (TurboRepo)
```
/
├── apps/
│   ├── api/             # Fastify backend services
│   └── web/             # Next.js frontend (App Router)
├── packages/
│   ├── ui/              # Shared React components & theme tokens
│   └── config/          # Shared config schemas & validators
├── scripts/             # Utility scripts (scaffold.sh, run-tasks.sh)
├── .cline/              # CLINE rule files & config
├── docker-compose.yml   # Local dev orchestration
├── turbo.json           # TurboRepo pipeline config
└── cline.config.js      # CLINE workflows & MCP mappings
```

## Core Services
| Service | Technology | Purpose | Key Features |
|---|---|---|---|
| **API Server** | Fastify + TypeScript | Core backend services | REST API, BullMQ jobs, Prisma ORM |
| **Web Frontend** | Next.js 15 App Router | User interface | Tailwind CSS, shadcn/ui, server components |
| **Database** | PostgreSQL (Supabase) | Data persistence | Prisma schema, pgvector for embeddings |
| **Queue System** | BullMQ + Redis | Background processing | Transcription jobs, sync workers |
| **Storage** | DigitalOcean Spaces | File storage | Audio recordings, artifacts |
| **AI Compute** | RunPod + OpenAI | ML processing | WhisperX transcription, GPT analysis |

## Data Flow
1.  **Ingestion**: Scheduler or webhook triggers sync handlers for Ringba, TrackDrive, Retriever → upsert to `unified.calls`.
2.  **Storage & Proxy**: `/api/audio/proxy` downloads, compresses via FFmpeg, uploads to DO Spaces → updates `recording_url`.
3.  **Transcription**: Worker VAD-splits audio, enqueues chunks to RunPod, stitches segments → stores in `unified.transcription_segments`.
4.  **AI Analysis**: Post-transcription summaries, sentiment, compliance flags via GPT-4 → writes to `unified.calls`.
5.  **Vector Indexing**: Embeddings generated per segment → stored in `unified.call_vectors` (pgvector).
6.  **Dashboard & Alerts**: Frontend uses WebSockets (`/api/dashboard/updates`) for live metrics and notifications.

## Authentication & Authorization
- **Auth**: NestJS Passport-JWT → `/api/auth/login` issues JWT tokens.
- **Roles**: `admin`, `viewer` guard endpoints (settings, credentials).
- **Policies**: Supabase RLS enforces row-level security by `user_id` for multi-tenancy.

## GitHub Repository & Maintenance
- Define and enforce branch strategy: `main`, `develop`, `feature/*`, `hotfix/*`.
- Protect critical branches (`main`, `develop`) with required pull request reviews and status checks.
- Use GitHub issue and PR templates for consistent workflows.
- Tag releases semantically (e.g., `v2025.07.17`) and maintain `CHANGELOG.md`.

## CI/CD & Environments
- **Development**: `docker-compose up --build` (Postgres, Redis, API, Web) with `docker-compose.override.yml` for hot-reload.
- **CI**: GitHub Actions (`ci.yml`) runs lint, tests, Docker build & migrations; nightly Dependabot & Snyk scans.
- **Staging/Prod**: Deploy Docker images to DigitalOcean App Platform (API) & Vercel (Web); env vars via GitHub Secrets; health checks at `/api/health`.

## Observability
- **Logging**: Pino → Logflare.
- **Metrics**: Prometheus-compatible at `/metrics` → Grafana dashboards.
- **Error Tracking**: Sentry for API & worker exceptions.
- **Uptime**: UptimeRobot pinging `/api/health` every 30s.

## Design System & Accessibility
- Scaffold Notion “Design System” page mirroring `packages/ui`: color tokens, typography, spacing, elevation, radii, iconography, and core component snippets (Button, Card, DataTable).
- Ensure WCAG 2.1 AA compliance: contrast ratios, keyboard navigation, screen reader support.
- Implement dark/light theme toggle using CSS custom properties.

## Containerization & Developer Workflow
- **Dockerfiles**: Multi-stage builds for `apps/api` and `apps/web`.
- **Compose**: `docker-compose.yml` with healthchecks, Redis; override for local dev; `docker-compose.ci.yml` for CI.
- **Backups**: Schedule `pg_dump` cron to DigitalOcean Spaces.
- **Tracing**: Integrate OpenTelemetry across services.
- **Local Commands**: Document `make dev`, `make test` in README.

## Security & Compliance Foundations
- **Compliance Prep**: Define HIPAA/SOC 2 scope, data handling policies, audit logging requirements.
- **Secret Management**: Implement Vault or GitHub Secrets for environment variables; rotate keys regularly.
- **Security Scanning**: Integrate Snyk, OWASP ZAP, and infrastructure-as-code scanners (e.g., Checkov) in the pipeline.
- **Access Control**: Onboard RBAC policies in Kubernetes manifests (if used) or Docker contexts; enforce least privilege.

## Quality & Testing Setup
- **Unit Testing**: Configure Jest/Mocha for unit tests; aim for ≥80% coverage.
- **Integration Testing**: Setup Postman/Newman or Playwright for end-to-end workflows on local CI containers.
- **Contract Testing**: Add Pact tests for consumer/producer contracts on critical APIs.
- **Linting & Formatting**: Enforce ESLint rules and Prettier formatting as a pre-commit hook via Husky.

## Documentation & Onboarding
- **Developer Onboarding**: Create a `CONTRIBUTING.md` with step-by-step setup instructions.
- **Architecture Docs**: Maintain updated diagrams (Mermaid) under `docs/architecture/overview.md`.
- **code-doc Comments**: Leverage TypeDoc or Swagger for API docs generation.
- **Notion Sync**: Automate daily sync of documentation from Notion using the CLINE MCP integration.