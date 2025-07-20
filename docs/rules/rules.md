---
title: "CallScript.io Development Rules"
date: "2025-07-20"
tags: ["rules", "standards", "best-practices"]
---

# CallScript.io Development Rules - Complete Reference

**Last updated:** July 19, 2025

---

## 🔷 CORE STANDARDS & BEST PRACTICES

### TypeScript Standards
- **Strict Mode:** Always use TypeScript strict mode (`"strict": true`)
- **Type Safety:** No `any` types except in legacy integration points
- **Interface Definitions:** Define interfaces for all data structures
- **Null Safety:** Handle null/undefined explicitly with optional chaining

### Error Handling Standards
- **Comprehensive Catching:** Catch and handle all possible errors
- **Descriptive Messages:** Error messages must be actionable and clear
- **Dead Letter Queue:** Failed operations go to dead letter queue
- **Retry Logic:** Implement exponential backoff for transient failures

---

## 🔷 TESTING RULES

### Coverage Requirements
- **Minimum Coverage:** ≥80% for all exported functions, classes, and modules
- **Line Coverage:** ≥80% of executable lines must be tested
- **Branch Coverage:** ≥75% of conditional branches must be tested
- **Function Coverage:** 100% of exported functions must have tests

---

## 🔷 SECURITY RULES

### Data Protection Standards
- **Encryption at Rest:** All sensitive data must be encrypted using AES-256
- **Encryption in Transit:** All API communications must use TLS 1.3 or higher
- **Key Management:** Use secure key management service (AWS KMS, Azure Key Vault)

### Authentication & Authorization
- **Multi-Factor Authentication:** Required for all admin and production access
- **Role-Based Access Control:** Implement RBAC with principle of least privilege
- **JWT Tokens:** Use short-lived JWTs (15 minutes) with refresh tokens

---

## 🔷 PERFORMANCE & QUALITY STANDARDS

- **Response Times:** <200ms for 95th percentile
- **Throughput:** Support 1000+ concurrent requests
- **Uptime SLA:** 99.9% uptime requirement
- **Health Checks:** Comprehensive health monitoring

---

## 🔷 ARCHITECTURE STANDARDS

- **Strict Layering:** UI → Business Logic → Data Access → Infrastructure
- **No Circular Dependencies:** Block cycles and auto-sync with package.json
- **Feature Organization:** Organize code by business capability
- **Single Responsibility:** One reason to change per module

---

## 🔷 DATABASE STANDARDS

- **Connection Pooling:** Use centralized PrismaClient instances
- **Transaction Management:** Wrap multi-step operations in transactions
- **Schema Consistency:** All DateTime fields use `@db.Timestamptz(6)`
- **Migration Safety:** All migrations must be reversible

---

## 🔷 PROHIBITED PRACTICES

- No `.skip` or `.only` in committed test code
- No hardcoded credentials in source code
- No circular dependencies between modules
- No shared mutable state between tests

---

## 🔷 DOCUMENTATION REQUIREMENTS

- **JSDoc Comments:** 20% minimum comment density
- **Function Documentation:** All public functions documented
- **API Documentation:** OpenAPI/Swagger specifications
- **CHANGELOG:** All changes documented per semver

---

## 🔷 FILE ORGANIZATION

- **Test Files:** One test file per source file (feature.ts → feature.test.ts)
- **Directory Structure:** `apps/{web,api}/(features|components|services|utils)/[a-z-]+/`
- **Maximum Folder Depth:** 4 levels for simple navigation

For complete details, see individual rule files in `.cline/rules/`