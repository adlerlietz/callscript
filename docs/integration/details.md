---
title: "Integration Details"
date: "2025-07-20"
tags: ["integration", "ringba", "api", "sync"]
source: "notion"
---

# Integration Details

## Ringba Integration

### 1. Overview

We pull call logs from Ringba (via Token auth) to track call count, revenue, cost, and campaign attribution. This service runs on a schedule (every 5 minutes) or via webhook and writes into our `unified.calls` table.

---

### 2. Environment Variables

| Variable | Description |
|----------|-------------|
| `RINGBA_API_TOKEN` | Bearer token for Ringba API authentication |
| `RINGBA_ACCOUNT_ID` | Account ID for Ringba API endpoints |

> ⚠️ **Secrets**: Store real values in your vault / GitHub Secrets; do not commit them to source control.

---

### 3. Authentication & HTTP Setup

- **Base URL**: `https://api.ringba.com/v2/{RINGBA_ACCOUNT_ID}/calllogs`
- **Headers**:
  - `Authorization: Bearer {RINGBA_API_TOKEN}`
  - `Content-Type: application/json`
  - `User-Agent: CallScript.io/1.0`

---

### 4. Client Implementation

**File**: `apps/api/src/lib/ringbaClient.ts`

- Uses Axios to POST JSON body (not query params).
- Caps date range to 90 days.
- Fetches pages of up to 1,000 records via `offset` until `totalCount`.

<details>
<summary><strong>Key Method: <code>fetchCalls(startDate, endDate)</code></strong></summary>

```javascript
const resp = await this.client.post('', {
  reportStart: startDate.toISODate(),
  reportEnd:   endDate.toISODate(),
  size:        1000,
  offset:      offset,
  valueColumns: [ /* callDt, inboundPhoneNumber, buyer, ... */ ]
});
if (!resp.data.isSuccessful) {
  throw new Error(`Ringba error: ${resp.data.message}`);
}
const records = resp.data.report.records as RingbaRawRecord[];
// Map each record, handle missing/invalid fields, compute revenue/cost/profit
```

</details>

---

### 5. Sync Handler

**File**: `apps/api/src/features/ringbaSync.ts`

**Route**: `POST /api/sync/ringba`

- **Body** (optional):
  - `startDate`: ISO date string
  - `endDate`: ISO date string
- **Defaults**: last 24 hours if omitted
- **Behavior**:
  1. Validates date range (max 90 days)
  2. Fetches all pages from Ringba API
  3. Maps and transforms records
  4. Bulk inserts into `unified.calls` table
  5. Returns summary with counts and metrics

---

### 6. Field Mapping & Pagination Logic

- **Date Range Cap**: max 90 days
- **Pagination**:
  - Page size: 1,000 records
  - Uses `offset` parameter
  - Continues until `totalCount` reached
- **Field Mappings**:
  - `callDt` → `call_date`
  - `inboundPhoneNumber` → `phone_number`
  - `buyer` → `buyer_name`
  - `publisher` → `publisher_name`
  - `revenue` → `revenue_amount`
  - `cost` → `cost_amount`
  - Computed `profit_amount` = revenue - cost

---

### 7. Error Handling & Logging

- Validates `startDate <= endDate`; throws `400` on invalid input
- Catches HTTP errors (`statusCode !== 200`), logs and re-throws
- Logs & skips malformed records (missing `callDt`, parse errors)
- Stops pagination loop on repeated empty pages or errors

---

### 8. Acceptance Criteria

- **Timeliness**: All calls for a given range in DB within **1 minute**
- **Accuracy**: ≥95% transcription-ready data
- **Idempotency**: No duplicates (uses `skipDuplicates`)
- **Reliability**: Retries up to 3 on transient errors; logs failures

---

## TrackDrive Integration

### Overview
TrackDrive integration follows a similar pattern to Ringba but with different API endpoints and field mappings.

**File**: `apps/api/src/lib/trackdriveClient.ts`

### Key Features
- Real-time webhook support
- Batch processing capabilities
- Custom field mapping for TrackDrive schema
- Rate limiting and retry logic

### API Configuration
- **Base URL**: `https://api.trackdrive.com/v1/calls`
- **Authentication**: API Key in headers
- **Rate Limits**: 100 requests/minute

---

## Other Integrations

### Retriever
*Coming soon - similar call tracking platform integration*

### Custom Webhooks
*Coming soon - generic webhook receiver for custom call platforms*

---

## Integration Testing

### Test Files
- `apps/api/src/test/ringbaConfig.test.ts`
- `apps/api/src/test/trackdriveSyncTest.ts`
- `apps/api/tests/ringbaHeaders.test.ts`

### Test Coverage
- Authentication flow testing
- Field mapping validation
- Error handling scenarios
- Pagination logic verification
- Rate limiting compliance

---

## Monitoring & Observability

### Metrics Tracked
- Sync success/failure rates
- Record processing counts
- API response times
- Error frequencies by type

### Alerts
- Failed sync operations
- API rate limit violations
- Data quality issues
- Connectivity problems

### Logging
All integration activities are logged with structured data including:
- Sync timestamps
- Record counts
- Error details
- Performance metrics