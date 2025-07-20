---
title: "Phase 4 – Frontend UI (Weeks 7–9)"
date: "2025-07-20"
tags: ["roadmap", "phase-4", "frontend", "ui"]
effort: "High"
status: "Planned"
---

# Phase 4 – Frontend UI (Weeks 7–9)

**Effort:** High
**Status:** 🚧 Planned

> 📋 Scope Note: Build a Next.js dashboard featuring real-time updates, role-based access, and analytics interfaces. This phase assembles the UI layer on top of API & AI services from earlier phases.

## 1. Next.js Dashboard Structure
- **Pages Directory:** Use App Router (`/app`) with folders:
- **Layout:** Create shared `RootLayout.tsx` with sidebar, top nav, and auth guard.
- **Styling:** Tailwind + shadcn/ui components; theme toggles driven by context.
- **Example `layout.tsx`:**
```javascript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Sidebar />
        <main className="ml-64 p-6">{children}</main>
      </body>
    </html>
  );
}
```

## 2. Real-time Features
- **Tech:** Use `socket.io-client` or native SSE via `EventSource`.
- **Dashboard Updates:** Connect to `/api/dashboard/updates` socket namespace:
- **Fallback:** SSE in browsers without WS.
- **Performance:** Throttle events client-side; batch updates every 500ms.

## 3. Authentication UI
- **Login Page:** `/app/login/page.tsx` with form calling `/api/auth/login`.
- **Auth Context:** React Context that stores JWT in `localStorage` & attaches to `fetch`/axios requests:
- **Route Protection:** Higher-order component or middleware in Next.js to redirect unauthenticated users to `/login`.
- **Role UI:** Hide/show elements based on decoded `role` claim (`admin` vs `viewer`).

## 4. Analytics UI
- **Charts Library:** `recharts` for line, bar, and pie charts; dynamic imports to optimize bundle size.
- **KPI Cards:** Create a `KpiCard` component showing number, delta, and icon.
- **Heatmaps:** Use a map visualization (e.g., `react-simple-maps`) for state-level RPC.
- **Filters & Controls:** Build a filter bar (`/components/FilterBar.tsx`) with date pickers and dropdowns.
- **Example KPI Card:**
```javascript
export function KpiCard({ title, value, delta }) {
  return (
    <Card>
      <CardHeader>
        <h4>{title}</h4>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm">{delta}% from yesterday</div>
      </CardContent>
    </Card>
  );
}
```

## 5. Call Detail & Audio Player
- **Audio Player:** HTML5 `<audio>` element wrapped in `AudioPlayer` component with play/pause and scrub features.
- **Transcript Viewer:** Scrollable panel showing speaker labels and timestamps; highlight current playback.
- **Actions:** Buttons for `Regenerate Summary`, `Flag for Review`, and `Download Transcript`.

## 6. AI Assistant Console
- **Component:** `ChatWindow` with messages list and input box.
- **API Calls:** POST to `/api/ai/chat` with conversation context.
- **Suggested Follow-ups:** Display clickable suggestion chips below the input.

## 7. Role-Based Access Control UI
- **UI Differences:** Disable editing buttons for `viewer` role; show admin controls (e.g., user management) only to `admin`.
- **Permission Checks:** Client-side guards complemented by API auth.