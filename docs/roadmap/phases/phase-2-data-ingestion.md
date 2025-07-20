---
title: "Phase 2 – Data Ingestion & Transcription (Weeks 3–4)"
date: "2025-07-20"
tags: ["roadmap", "phase-2", "data-ingestion"]
effort: "High"
status: "Next Phase"
---

# Phase 2 – Data Ingestion & Transcription (Weeks 3–4)

**Effort:** High
**Status:** 🚧 Next Phase

> ❌ NOT STARTED: Audio pipeline and storage infrastructure not yet implemented.
> 🚧 NEXT PHASE: Audio proxy, storage, and transcription pipeline implementation.

## 1. Audio Proxy & Storage
- **Route:** `POST /api/audio/proxy` in `apps/api/src/routes/audio.ts`
- **Inputs:** `{ callId: string, recordingUrl: string }`
- **Behavior:**
- **Error Handling:** retry 2× on network errors; return 502 on compression failure.

## 2. Transcription Pipeline
- **Worker Job:** BullMQ job named `transcribe-call` in `apps/api/src/workers/transcribe.ts`
- **Chunk Enqueue:** After proxy, push job:
- **RunPod API Call:**
- **Adaptive Polling:** Poll status endpoint with exponential backoff until `completed`.
- **Result Stitching:** Concatenate returned segments into single transcript string.
- **Prisma Update:** Insert into `unified_transcription_segments` and set `has_transcription = true`.
- **Metrics:** Record job duration & success/failure in Redis counters.

## 3. Audio Processing & VAD Splitting
- **Library:** Use `@web-tools/voice-activity-detector` or Pyannote via child process.
- **Chunk Logic:**
- **Segment Management:** Write each chunk to temp file, upload immediately to Spaces, then enqueue transcription jobs for each chunk ID.
- **Cleanup:** Remove temp files after successful upload and enqueue.

## 4. Queue System & Job Orchestration
- **Queue Names:**
- **Worker Pools:** Separate concurrency for IO-bound (audio proxy) vs CPU-bound (transcription).
- **Retries & DLQ:** Configure `attempts: 3`, `backoff: { type: 'exponential', delay: 5000 }`, and a dead-letter queue for permanently failed jobs.
- **Monitoring:** Expose queue metrics via Bull Board (`/admin/queues`).