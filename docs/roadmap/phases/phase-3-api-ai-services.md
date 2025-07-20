---
title: "Phase 3 – API & AI Services (Weeks 5–6)"
date: "2025-07-20"
tags: ["roadmap", "phase-3", "api", "ai"]
effort: "High"
status: "Planned"
---

# Phase 3 – API & AI Services (Weeks 5–6)

**Effort:** High
**Status:** 🚧 Planned

> 📋 Scope Note: Enable AI-powered analysis, summaries, semantic search, and compliance checks. This phase builds on Phase 2’s transcription pipeline.

## 1. GPT-4 Integration
- **Endpoint:** `POST /api/ai/calls/:callId/summary`
- **Input:** `{ callId: string }`
- **Behavior:**
- **Error Handling:** Retry on rate limit; circuit-breaker after 5 failures.
- **Validation:** Unit tests with mock transcripts; integration tests calling real API in sandbox.

## 2. Semantic Search
- **Setup:** Add `unified.call_vectors` table with `vector` column (pgvector).
- **Indexing Job:** Scheduled worker to embed new segments:
- **Search Endpoint:** `GET /api/ai/search?query=...`:
- **Performance:** Ensure ivfflat index on `vector` for sub-50ms queries.

## 3. Compliance & QA
- **Flag Types:** Negative sentiment, profanity, PII detected, call too short, silence too long.
- **Rules Engine:** Define JSON-based rule set in `config/compliance.json`:
- **Processing:** After transcription, run sentiment analysis (via GPT or custom model) per segment and apply rules to generate `unified.qa_flags`.
- **Endpoints:**
- **Dashboard Hooks:** Emit WebSocket event on new flag via `/api/dashboard/alerts`.

## 4. Analytics Engine
- **Metrics Calculation:**
- **View:** New endpoint `GET /api/analytics/metrics?groupBy=campaign&date=2025-07-20`.
- **AI Insights:** Generate daily insights via scheduled job:
- **Storage:** Persist generated insights in `unified.daily_insights` table for audit.

## Dependencies & Missing Components
- **Transcription Pipeline**: Ensure Phase 2’s RunPod/WhisperX integration is live.
- **Audio Splitting**: VAD-based chunking must be operational.
- **AI Pipeline**: Prompt templates and error-handling wrappers for Grok/CLAUDE.
- **Vector Index**: pgvector extension enabled on Supabase.