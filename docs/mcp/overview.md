---
title: "MCP Servers Overview"
date: "2025-07-20"
tags: ["mcp", "servers", "integrations"]
---

# CallScript.io MCP (Model Context Protocol) Servers - Comprehensive Reference

**Last updated:** July 19, 2025
**Current Status:** 9 Active MCP Servers

---

### . project-setup
- 🧠 *Why it's critical*: Bootstraps everything — monorepo, types, build, lint, test, `.env`, and scripts.
- ✅ Sets a clean foundation from day one
- 📦 Includes: Turborepo config, ESLint, Prettier, Husky, TypeScript paths, and Git hooks
- 📌 Use this before adding any features

### 2. monorepo-structure
- 🧠 *Why it's critical*: Gives you a maintainable folder layout across apps/api, apps/web, shared packages
- 📦 Comes with naming conventions, workspace boundaries, and clean import maps
- 📌 Essential for scaling code without creating file sprawl

### 3. typesafety
- 🧠 *Why it's critical*: Makes sure you’re passing validated, typed data across API routes, DB, and UI
- 📦 Adds Zod, tRPC, or other validators
- 📌 Prevents the exact kind of silent API breakage you had with Ringba last time

### 4. cli-utils
- 🧠 *Why it's critical*: Quickly run jobs, clear logs, sync Ringba, or queue transcription
- 📦 Comes with helper CLI scaffolding using `ts-node`, `commander`, etc.
- 📌 Vital for managing ingestion + AI jobs without bloating the API server