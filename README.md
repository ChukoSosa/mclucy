# Mission Control Office

Operational dashboard for Mission Control API.

This project is the Phase 1 foundation for a future virtual office UI. It provides a production-minded frontend baseline with typed API integration, runtime validation, live updates via SSE, and filterable operational views.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Font Awesome
- TanStack Query
- Zod
- Zustand
- date-fns
- clsx + tailwind-merge

## Features

- Dashboard with agents, tasks, task detail/subtasks, activity feed, KPIs, and SSE event panel
- Global filters for search, agent, task status, and activity limit
- Clickable agent cards with detail modal:
	- Agent profile/status
	- Assigned tasks
	- Last and recent activity
- API client layer with centralized proxy access
- Resilient parsing for backend payload variations
- Graceful error handling when upstream API is unavailable

## Project Structure

```text
app/
	layout.tsx
	page.tsx
	dashboard-page.tsx
	providers.tsx
	globals.css
	not-found.tsx
	proxy/[...path]/route.ts

components/
	dashboard/
		ActivityFeedPanel.tsx
		AgentDetailModal.tsx
		AgentsPanel.tsx
		FiltersBar.tsx
		KpiPanel.tsx
		SSEPanel.tsx
		SummaryBar.tsx
		TaskDetailPanel.tsx
		TasksPanel.tsx
	ui/
		Card.tsx
		EmptyState.tsx
		ErrorMessage.tsx
		Skeleton.tsx
		StatusBadge.tsx

lib/
	api/
	schemas/
	sse/
	utils/

store/
types/
```

## Environment

Create or edit `.env.local`:

```env
NEXT_PUBLIC_MISSION_CONTROL_API_BASE_URL=http://192.168.0.17:3000
```

Important:
- If your API runs on another machine in the LAN, use that machine IP.
- Do not use `localhost` unless API and frontend are on the same host.

## Install

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Default frontend URL:
- `http://localhost:3001`

Production build:

```bash
npm run build
npm run start
```

## API Integration Notes

All frontend calls go through Next route proxy:
- Frontend calls: `/proxy/api/...`
- Proxy forwards to `NEXT_PUBLIC_MISSION_CONTROL_API_BASE_URL`

This avoids browser-side CORS issues and gives clearer upstream errors.

If upstream is down/unreachable, proxy returns:

```json
{
	"error": "UPSTREAM_UNAVAILABLE",
	"message": "fetch failed",
	"apiBaseUrl": "..."
}
```

## Activity Feed Compatibility

The activity integration accepts multiple backend shapes:

- Array payload directly
- Object payload with keys like:
	- `activity`
	- `items`
	- `logs`
	- `events`

And supports timestamp field variants:

- `createdAt`
- `timestamp`
- `updatedAt`
- `occurredAt`

## Global Filters

The filter bar supports:

- Free text search (tasks + activity)
- Agent filter
- Task status filter
- Activity limit selector
- Reset all filters

## Troubleshooting

### 1) API returns 500/502 in dashboard

Check backend reachability from frontend machine:

```powershell
Invoke-WebRequest -Uri "http://192.168.0.17:3000/api/tasks" -UseBasicParsing
```

If it fails:
- ensure backend is running
- ensure backend binds to `0.0.0.0`
- ensure firewall allows port `3000`

### 2) Port 3001 already in use

```powershell
$conn = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
```

### 3) Build fails with `.next/trace` EPERM

Stop dev server first, then run `npm run build`.

## Current Phase

Phase 1 is complete: baseline operational dashboard and API connection.

Next recommended phase:
- virtual pixel-art office visualization layer reusing the same data/API foundations.
