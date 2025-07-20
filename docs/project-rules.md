# CallScript.io Development Standards

[![CI Status](https://github.com/adlerlietz/callscript/workflows/CI/badge.svg)](https://github.com/adlerlietz/callscript/actions)

## Mission & Goals

**CallScript.io** delivers enterprise-grade call transcription and analytics with:
- **95%+ transcription accuracy**
- **<10% ingestion failures**
- **Real-time dashboards (<30s latency)**
- **80%+ test coverage**
- **99.9% uptime**

---

## Must-Have Code Principles (MCPs)

<details>
<summary><strong>🔷 TypeScript Standards</strong></summary>

### Rules
- **Strict mode enabled** in `tsconfig.json`
- **No `any` types** - use explicit interfaces or `unknown`
- **Explicit interfaces** for all API contracts and data models
- **Null-safety** - handle `null`/`undefined` explicitly

### Example
```typescript
// ✅ Good
interface UserData {
  id: string;
  email: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

// ❌ Bad
const userData: any = getUser();
```

### Enforcement
- ESLint rules: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/strict-boolean-expressions`
- CI fails on TypeScript errors

</details>

<details>
<summary><strong>🔷 Error Handling</strong></summary>

### Rules
- **Clear error messages** with context and actionable guidance
- **Dead-letter queue** for failed operations
- **Exponential backoff** with jitter for retries
- **Structured logging** with correlation IDs

### Example
```typescript
// ✅ Good
try {
  await processTranscription(audioFile);
} catch (error) {
  logger.error('Transcription failed', {
    correlationId: req.id,
    audioFileId: audioFile.id,
    error: error.message,
    retryCount: attempt
  });
  
  if (attempt < MAX_RETRIES) {
    await delay(exponentialBackoff(attempt));
    return retryTranscription(audioFile, attempt + 1);
  }
  
  await deadLetterQueue.send(audioFile);
  throw new TranscriptionError('Max retries exceeded', { audioFileId: audioFile.id });
}
```

### Enforcement
- All async operations must have error handling
- Dead-letter queue integration required for critical paths

</details>

<details>
<summary><strong>🔷 Testing Standards</strong></summary>

### Coverage Requirements
- **≥80% line coverage**
- **≥80% function coverage**
- **≥75% branch coverage**

### Test Types
- **Unit tests**: Pure functions, business logic
- **Integration tests**: API endpoints, database operations
- **E2E tests**: Critical user flows

### Example Structure
```
src/
├── services/
│   ├── transcription.service.ts
│   └── __tests__/
│       ├── transcription.service.unit.test.ts
│       └── transcription.service.integration.test.ts
```

### Enforcement
- CI fails if coverage drops below thresholds
- Required tests for all new features

</details>

<details>
<summary><strong>🔷 Linting & Formatting</strong></summary>

### Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Configuration
```json
// .eslintrc.js
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Enforcement
- Pre-commit hooks run lint + format
- CI fails on lint errors
- No commits allowed with formatting issues

</details>

<details>
<summary><strong>🔷 API Contracts</strong></summary>

### Requirements
- **OpenAPI 3.0+ specs** for every endpoint
- **Request/response validation** using schemas
- **API versioning** with backward compatibility
- **Rate limiting** and authentication

### Example
```yaml
# openapi.yml
paths:
  /api/v1/transcriptions:
    post:
      summary: Create transcription job
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TranscriptionRequest'
      responses:
        '201':
          description: Transcription job created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TranscriptionResponse'
```

### Enforcement
- Schema validation in middleware
- Auto-generated API docs
- Contract testing in CI

</details>

<details>
<summary><strong>🔷 Git Standards</strong></summary>

### Branch Naming
- `feature/TICKET-123-short-description`
- `bugfix/TICKET-456-fix-audio-upload`
- `hotfix/critical-security-patch`

### Commit Messages
```
type(scope): brief description

Longer explanation if needed.

Fixes #123
```

### PR Requirements
- **Code review** from at least 1 team member
- **All CI checks** must pass
- **Branch up-to-date** with main
- **Squash and merge** for clean history

### Enforcement
- Branch protection rules on `main`
- Required status checks
- PR template with checklist

</details>

---

## Architecture Overview

### Tech Stack
- **API**: Fastify + TypeScript
- **Web**: Next.js + shadcn/ui
- **Database**: PostgreSQL + Prisma
- **Queue**: Redis + Bull
- **Storage**: DigitalOcean Spaces
- **Transcription**: RunPod + Whisper
- **Monitoring**: DataDog + Sentry

### Project Structure
```
├── apps/
│   ├── api/         # Fastify TypeScript service
│   └── web/         # Next.js + shadcn/ui
├── packages/
│   ├── ui/          # shared React components
│   ├── config/      # env schemas, shared types
│   └── database/    # Prisma schema & migrations
├── docs/
│   ├── project-rules.md
│   ├── architecture.md
│   └── api/         # OpenAPI specs
├── .github/
│   └── workflows/   # CI/CD pipelines
└── tools/           # scripts, utilities
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+

### Setup
```bash
# Clone and install
git clone https://github.com/adlerlietz/callscript.git
cd callscript
pnpm install

# Environment setup
cp .env.example .env
# Fill in your environment variables

# Database setup
pnpm db:migrate
pnpm db:seed

# Start development
pnpm dev
```

### Commands
```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm test         # Run all tests
pnpm test:coverage # Run tests with coverage
pnpm lint         # Lint all code
pnpm format       # Format all code
pnpm type-check   # TypeScript type checking
```

---

## CI/CD Pipeline

### On Pull Request
1. **Lint & Format Check**
2. **TypeScript Type Check**
3. **Unit & Integration Tests**
4. **Coverage Report**
5. **Build Verification**

### On Main Branch
1. **All PR checks**
2. **E2E Tests**
3. **Security Scan**
4. **Deploy to Staging**
5. **Smoke Tests**

### On Release Tag
1. **All checks**
2. **Deploy to Production**
3. **Health Check**
4. **Rollback on Failure**

---

## Monitoring & Alerts

### Key Metrics
- **Transcription Accuracy**: >95%
- **API Response Time**: <200ms p95
- **Queue Processing**: <30s p95
- **Error Rate**: <1%
- **Uptime**: >99.9%

### Alerts
- **High Error Rate**: >5% in 5min
- **Slow Response**: >500ms p95 in 5min
- **Queue Backlog**: >1000 jobs
- **Low Disk Space**: <10% free
- **Service Down**: Health check fails

---

## Security

### Authentication
- **JWT tokens** with short expiration
- **Refresh token** rotation
- **API key** authentication for integrations

### Data Protection
- **Encryption at rest** for sensitive data
- **TLS 1.3** for all communications
- **PII scrubbing** in logs
- **GDPR compliance** for EU users

### Infrastructure
- **VPC isolation**
- **Security groups** with minimal access
- **Regular security updates**
- **Vulnerability scanning**

---

## Support & Documentation

- **API Docs**: [https://api.callscript.io/docs](https://api.callscript.io/docs)
- **User Guide**: [https://docs.callscript.io](https://docs.callscript.io)
- **Status Page**: [https://status.callscript.io](https://status.callscript.io)
- **Support**: [support@callscript.io](mailto:support@callscript.io)

---

*Last updated: 2025-07-20*
*Version: 1.0.0*