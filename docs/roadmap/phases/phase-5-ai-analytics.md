---
title: "Phase 5 – AI & Analytics Enhancements (Weeks 10–11)"
date: "2025-07-20"
tags: ["roadmap", "phase-5", "ai", "analytics"]
effort: "Medium"
status: "Planned"
---

# Phase 5 – AI & Analytics Enhancements (Weeks 10–11)

**Effort:** Medium
**Status:** 🚧 Planned

> 📋 Scope Note: Build on Phase 3's AI services by introducing advanced analytics, cost/revenue reporting, custom flags, and scheduled insights—empowering users with actionable intelligence.

## 1. Cost & Revenue Analytics
- **SQL View:** Create `analytics.call_financials` in Supabase:
- **Endpoint:** `GET /api/analytics/financials?start=YYYY-MM-DD&end=YYYY-MM-DD`
- **Frontend Widgets:** KPI cards for total revenue, cost, profit; time-series chart via Recharts.

## 2. Custom AI Flags & Compliance Reporting
- **Flag Types:** Extend `unified.qa_flags` with new types:
- **Rules Engine:** Store rules in `config/flags.json` and reloadable at runtime:
- **Reporting:** Scheduled job (`cron` via Supabase Functions) runs daily:
- **Endpoint:** `GET /api/analytics/flags?date=YYYY-MM-DD` returns counts per flag type.

## 3. Daily Trend Insights & Alerts
- **Scheduled Job:** Supabase Edge Function or GitHub Action at 6 AM UTC:
- **Inbox:** Send email & in-app notification with key takeaways (e.g., top-performing campaigns, anomalies).
- **UI:** Add `/app/insights` page showing past 7 days of AI-generated summaries.

## 4. Advanced Dashboards & Drill-Downs
- **Drill-Down Charts:** Click on KPI (e.g., campaign) to filter TimeSeries and Maps.
- **Pivot Tables:** Allow users to pivot by platform, state, or buyer in a tabular view.
- **Table Exports:** CSV/XLSX exports of analytics datasets via `GET /api/analytics/export?type=financials`.