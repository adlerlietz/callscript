---
title: "Phase 1 – Core Monorepo & Dev Workflow (Weeks 1–2)"
date: "2025-07-20"
tags: ["roadmap", "phase-1", "monorepo"]
effort: "High"
status: "Completed"
---

# Phase 1 – Core Monorepo & Dev Workflow (Weeks 1–2)

**Effort:** High
**Status:** ✅ Completed

> 📋 V1 SCOPE NOTE: Initial release focuses exclusively on Ringba integration. Multi-platform support (TrackDrive, etc.) will be added in future versions.

## 1. Database Architecture
- **Prisma Model:** Defined in `schema.prisma` under `apps/api/prisma/`:
- **Migrations:** Ran `prisma migrate dev` → `prisma migrate deploy` against Supabase; validated column types and defaults.
- **Row‑Level Security:** Supabase policies in SQL:
- **Indexes:** Added on `(platform)`, `(campaign_id)`, and `(timestamp)` for query performance.

## 2. Platform Integrations
### 2.1 Ringba Client Implementation
- **Auth & Endpoint:** `POST https://api.ringba.com/v2/{accountId}/calllogs`
- **Key Method:** `ringbaClient.fetchCalls(start, end)` in `apps/api/src/lib/ringbaClient.ts`:
- **Pagination & Retries:** Loop `offset += size` until `offset >= totalCount`; retry up to 3x for 429 or 5xx.
- **Error Handling:** Logs failures to Sentry and routes bad records to a dead-letter queue in Redis.
- **Validation:** Post-ingest check ensures record count matches `totalCount` within 1 minute.

### 2.2 TrackDrive Client Implementation
- **Endpoint:** `GET https://{subdomain}.trackdrive.com/api/v1/calls?cursor={cursor}`
- **Client:** `apps/api/src/lib/trackdriveClient.ts`, uses Axios with API key header.
- **Pagination:** Uses `nextCursor` from response until null; resilient to empty pages.
- **Data Mapping:** Normalizes fields into `unified_calls` via Prisma, similar to Ringba.
- **Credential Flow:** Supports OAuth2 with PKCE; tokens stored in `platform_credentials`.

## 3. Security Framework
- **Supabase Table:** `platform_credentials` with JSONB `credentials` field.
- **Encryption:** Field-level encryption via Supabase Edge Functions + pgcrypto.
- **Auth:** Fastify guards read/write by verifying JWT `user_id` against RLS policies.
- **Rotation:** Built-in endpoint `PUT /api/settings/platforms/:platform/rotate` triggers credential re-encryption.

## 4. Testing Infrastructure
- **Unit Tests:** Jest in `apps/api/tests/unit/`, covering utility functions and client mappers.
- **Integration Tests:** Supertest + real Supabase test instance for `/api/sync/ringba` and `/api/sync/trackdrive`.
- **E2E Smoke Tests:** Playwright in `e2e/`, running full ingest → query → validate workflow.
- **Coverage:** Enforced ≥80% via Jest config; report uploaded to Codecov on CI.
- **CI Pipeline:** `.github/workflows/ci.yml` runs: