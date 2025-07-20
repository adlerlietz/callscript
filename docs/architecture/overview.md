---
title: "Architecture Overview"
date: "2025-07-20"
tags: ["architecture", "system-design", "infrastructure"]
source: "notion"
---

# Architecture Overview

Below is a detailed breakdown of all the moving parts in CallScript.io. If you need to see exactly how we wired up pieces in our old build, you can query Cursor (e.g., "How was RunPod configured in the legacy pipeline?") and reference those snippets here.

---

## 1. Monorepo Structure (TurboRepo)

```
/
├── apps/
│   ├── api/             # Fastify backend services
│   └── web/             # Next.js frontend (App Router)
├── packages/
│   ├── ui/              # Shared React components & theme tokens
│   └── config/          # Shared config schemas, environment validators
├── scripts/             # Utility scripts (scaffold.sh, run-tasks.sh)
├── .cline/              # CLINE rule files & config
├── docker-compose.yml   # Local dev orchestration
├── turbo.json           # TurboRepo pipeline config
└── cline.config.js      # CLINE workflows & Notion MCP mappings
```

---

## 2. Core Services

| Service | Technology | Purpose | Key Features |
|---------|-----------|---------|-------------|
| **API Server** | Fastify + TypeScript | Core backend services | REST API, BullMQ jobs, Prisma ORM |
| **Web Frontend** | Next.js 15 App Router | User interface | Tailwind CSS, shadcn/ui, server components |
| **Database** | PostgreSQL (Supabase) | Data persistence | Prisma schema, pgvector for embeddings |
| **Queue System** | BullMQ + Redis | Background processing | Transcription jobs, sync workers |
| **Storage** | DigitalOcean Spaces | File storage | Audio recordings, artifacts |
| **AI Compute** | RunPod + OpenAI | ML processing | WhisperX transcription, GPT analysis |

---

## 3. Data Flow

### 1. **Ingestion**
- Multi-platform call data ingestion (Ringba, TrackDrive, etc.)
- Automated pagination and rate-limit handling
- Error retry mechanisms with exponential backoff
- Real-time sync capabilities

### 2. **Storage & Proxy**
- Secure audio download and proxy
- FFmpeg compression for optimized storage
- DigitalOcean Spaces integration
- Metadata extraction and indexing

### 3. **Transcription**
- VAD (Voice Activity Detection) splitting
- WhisperX processing on RunPod GPUs
- Segment stitching and quality assurance
- Storage in `call_chunks` table

### 4. **AI Analysis**
- GPT-4/Grok powered analysis
- Sentiment scoring and compliance flags
- Summary generation and key insights
- Quality control automation

### 5. **Vector Indexing**
- pgvector embeddings for semantic search
- Real-time indexing of transcripts
- Similarity matching and clustering
- Performance optimization

### 6. **Dashboard & Alerts**
- Real-time KPI updates
- Interactive visualizations
- Anomaly detection
- Compliance breach alerts

---

## 4. Authentication & Authorization

### **Auth Skeleton** (NestJS Passport-JWT)
- JWT-based authentication system
- Role-based access control (admin/viewer)
- Session management and refresh tokens
- API key authentication for integrations

---

## 5. CI/CD & Environments

### **Development**
- Local Docker Compose setup
- Hot reloading for both frontend and backend
- Development database seeding
- Mock services for external APIs

### **CI**
- GitHub Actions pipeline
- Automated testing (Jest + React Testing Library)
- ESLint and Prettier code quality checks
- Docker multi-stage builds

### **Staging & Production**
- DigitalOcean App Platform deployment
- Environment-specific configurations
- Database migrations and rollbacks
- Blue-green deployment strategy

---

## 6. Observability

- **Logging**: Pino on API & Workers, centralized in Logflare.
- **Metrics**: Prometheus-compatible metrics emitted on `/metrics`, visualized in Grafana (optional).
- **Error Tracking**: Sentry captures exceptions from API & Workers.
- **Uptime**: DigitalOcean Uptime Monitoring with `/api/health` ping.

---

## 7. How to Reference Legacy Setup in Cursor

> **Prompt example:**
> "Cursor, show me the RunPod endpoint configuration and Docker commands we used in the legacy transcription pipeline."

You can copy those snippets from Cursor to refine our current Dockerfiles and worker logic.

---

## Technical Stack Summary

### Backend
- **Runtime**: Node.js with Fastify framework
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis backing
- **Authentication**: JWT with Passport.js

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: React hooks and context
- **Testing**: Jest + React Testing Library

### Infrastructure
- **Database**: Supabase (managed PostgreSQL)
- **Storage**: DigitalOcean Spaces (S3-compatible)
- **Deployment**: DigitalOcean App Platform
- **CDN**: DigitalOcean Spaces CDN
- **Monitoring**: Sentry + custom health checks

### AI & ML
- **Transcription**: WhisperX on RunPod GPU instances
- **Analysis**: OpenAI GPT-4 and Anthropic models
- **Vector Search**: pgvector with PostgreSQL
- **Audio Processing**: FFmpeg for compression

---

*Copy this into your Notion "Architecture Overview" page. Use toggles around each major section if you’d like collapsible detail.*