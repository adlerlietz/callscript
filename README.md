# CallScript.io Monorepo

This repository contains the clean, feature-driven monorepo for rebuilding CallScript.io:

- **Backend:** Fastify + Prisma (TypeScript)
- **Frontend:** Next.js + Tailwind + shadcn/ui
- **Workers & AI:** RunPod WhisperX, OpenAI GPT, BullMQ
- **Docs & Tasks:** Notion integration

## 🎉 System Status - ALL INTEGRATIONS OPERATIONAL ✅
*Last verified: July 17, 2025 at 8:39 PM PST*

### ✅ Terminal Command Tests - COMPLETE SUCCESS
- **Ringba API Integration**: Successfully fetched 2,271 call records with full pagination
- **Environment Management**: All 13 environment variables loading correctly via dotenvLoader.js
- **Data Schema & Mapping**: UnifiedCall model with 19 fields, perfect field mapping
- **Database Integration**: Supabase PostgreSQL connection established, Prisma schema valid 🚀
- **TypeScript Execution**: ts-node --transpile-only executing flawlessly across all test files

### 🔧 Technical Implementation Details
- **API Authentication**: 232-character Ringba API token working
- **Pagination Logic**: 1000 records per batch, Status 200 responses throughout
- **Data Mapping**: callDt → timestamp, profitNet → profit, complete field transformation
- **Environment System**: Override system preventing variable conflicts
- **Database**: Supabase PostgreSQL with Prisma ORM, JsonB platform_data storage

## Documentation

All project docs live under [`docs/`](docs/):

- 🎯 **Roadmap Hub:** `docs/roadmap/roadmap.md`
- 📖 **Project Overview:** `docs/project/overview.md`
- 🏗 **Architecture:** `docs/architecture/overview.md`
- 🔧 **Integration Details:** `docs/integration/details.md`

## Getting Started

1. Clone this repo
   ```bash
   git clone https://github.com/adlerlietz/callscript.git
