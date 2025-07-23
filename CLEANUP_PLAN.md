# Codebase Cleanup Plan

## Current State Analysis
- **97 test files** scattered throughout the project
- **31 debug files** (excluding node_modules)
- Multiple duplicate/outdated test implementations
- No organized test structure

## Test File Categories & Cleanup Strategy

### 🟢 KEEP - Core Production Tests
```bash
# Essential tests for production pipeline
test-e2e-chunking-pipeline.js          # Current chunking implementation
test-complete-pipeline.js              # End-to-end validation
test-mcp-do-5-e2e.js                   # DigitalOcean integration
services/api/src/scripts/test-transcription-worker.js  # Worker validation
```

### 🟡 CONSOLIDATE - Similar Functionality
```bash
# Ringba API Tests (consolidate into 1-2 files)
test-ringba.js
test-ringba-execution.js
test-simple-ringba.js
test-ringba-todays-calls.js
test-ringba-current-dates.js
test-ringba-correct-config.js
test-ringba-endpoint-fix.js
test-ringba-call-selection.js
test-pipeline-with-ringba-calls.js
test-pipeline-with-fixed-ringba-query.js
test-todays-calls-pipeline.js

# RunPod Tests (consolidate into 1-2 files)
test-runpod-transcription.js
test-runpod-direct.js
test-runpod-simple.js
test-runpod-small.js
test-runpod-endpoints.js
test-runpod-ready.js
test-runpod-serverless.js
test-runpod-production-migration.js
services/api/src/scripts/test-runpod-*.js (multiple files)

# WhisperX Tests (consolidate into 1 file)
test-whisperx-real-audio.js
test-whisperx-api.js
test-whisperx-robust.js
debug-whisperx-simple.js
```

### 🔴 DELETE - Outdated/Duplicate Tests
```bash
# Development/debugging files no longer needed
test-transcription-fixed.js
test-transcription-workflow.js
test-real-transcription.js
final-working-pipeline-test.js
simple-runpod-test.js
submit-test-job.js
debug-request.js
debug-ringba-api-query.js

# MCP ticket tests (completed, can archive)
test-mcp-do-3-integration.js
test-mcp-do-4-api.js
run-do-tests.js

# Duplicate/similar functionality
test-do-connection.js
test-do-limited-permissions.js
test-do-runpod-e2e.js
services/api/src/scripts/test-do-*.js (multiple files)
```

## Proposed New Test Structure
```bash
tests/
├── unit/
│   ├── ringba-api.test.js          # Consolidated Ringba tests
│   ├── runpod-integration.test.js  # Consolidated RunPod tests
│   ├── audio-processing.test.js    # WhisperX + chunking tests
│   └── digitalocean.test.js        # DO Spaces integration
├── integration/
│   ├── e2e-pipeline.test.js        # Complete pipeline test
│   └── worker-processing.test.js   # BullMQ worker tests
└── scripts/
    ├── validate-pipeline.js        # Production validation
    └── performance-test.js         # Load testing
```

## Cleanup Actions
1. **Create organized test directory structure**
2. **Consolidate similar tests into comprehensive suites**
3. **Delete outdated/duplicate files**
4. **Update package.json test scripts**
5. **Create test documentation**

## Files to Delete (Safe to Remove)
- All debug-*.js files in root directory
- Duplicate test files identified above
- Old MCP ticket validation files
- Development-only test scripts

## Estimated Cleanup Impact
- **Before**: 97 test files, ~15MB of test code
- **After**: ~10-15 organized test files, ~3-5MB
- **Reduction**: ~85% fewer files, cleaner structure