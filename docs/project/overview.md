---
title: "Project Overview"
date: "2025-07-20"
tags: ["project", "overview", "goals"]
---

# Project Overview

**CallScript.io** is a next-generation pay-per-call analytics and intelligence platform built to give performance marketers, call centers, and affiliate partners end-to-end visibility into every call. By seamlessly ingesting raw call data, transcribing audio, and applying AI-driven analysis, CallScript.io transforms voice interactions into actionable insights—optimizing campaigns, improving agent performance, and driving higher ROI.

### Mission & Goals
- **Mission:** Empower marketers and call centers with real-time, AI-powered call analytics so they can make data-driven decisions and maximize call revenue.
- **Primary Goals:**
  - **Accuracy:** ≥95% transcription accuracy via WhisperX + custom language models
  - **Reliability:** <10% failure rate on call ingestion or transcription
  - **Velocity:** Near-real-time dashboards (data <30 sec old)
  - **Quality:** ≥80% automated test coverage across backend + frontend
  - **Uptime:** ≥99.9% service availability

### Core Features
1. **Multi-Platform Ingestion**
   - Pull call logs and recordings from Ringba, TrackDrive, Retriever, etc.
   - Automatic pagination, error-retries, and rate-limit handling
2. **Audio Proxy & Storage**
   - Securely download recordings, compress via FFmpeg, and store in DigitalOcean Spaces
3. **Chunked Transcription Pipeline**
   - VAD splitting → WhisperX on RunPod GPUs → stitch segments → store in `call_chunks`
   - Multilingual auto-detection and cost-optimized batching
4. **AI-Powered Analysis**
   - Summaries, sentiment scoring, compliance/QC flags via GPT-4/Grok
   - Semantic search across transcripts using pgvector
5. **Real-Time Dashboards**
   - KPI cards (call volume, revenue, RPC)
   - Interactive charts, heatmaps, state-by-state performance
   - Live Alerts for anomalies or compliance breaches
6. **Campaign & Call Management**
   - Unified schema for calls, campaigns, buyers, publishers
   - Detail pages with audio player, transcript viewer, talk-time analytics
7. **AI Assistant Console**
   - Natural-language query interface
   - Chat-based insights, drill-downs, and recommendation generation
8. **Admin & Settings**
   - Role-based access (admin/viewer)
   - Webhook management, credentials vault, feature toggles

### High-Level Architecture
- **Monorepo** (TurboRepo) with workspaces:
  - **apps/api** (Fastify + TypeScript)
  - **apps/web** (Next.js App Router + Tailwind + shadcn/ui)
  - **packages/ui** (shared React components + design tokens)
  - **packages/config** (shared config, environment schemas)
- **Database**: PostgreSQL (Supabase pooler) + pgvector for embeddings
- **ORM**: Prisma with automated migrations and Studio
- **Queue & Workers**: BullMQ (Redis) for background jobs (transcription, syncs)
- **AI Compute**: RunPod WhisperX endpoints + OpenAI GPT-4
- **Storage**: DigitalOcean Spaces for audio & artifacts
- **CI/CD**: GitHub Actions + Docker multi-stage builds + deploy to DO App Platform / Vercel
- **Automation**: CLINE MCP for Notion syncs and daily reminders

### Target Users & Use Cases
- **Performance Marketers** track RPC & conversion rates across dozens of campaigns
- **Call Center Managers** monitor agent talk-time, QA flags, and sentiment trends
- **Affiliate Networks** ensure buyer/publisher performance and compliance
- **Compliance Officers** receive real-time alerts on policy violations or risky calls

### Success Metrics & KPIs
- **Transcription Accuracy:** ≥95%
- **Ingestion Reliability:** <10% failed calls
- **Dashboard Latency:** Data <30s old
- **Test Coverage:** ≥80%
- **Uptime:** ≥99.9%
- **User Adoption:** 50+ active campaigns in first 3 months