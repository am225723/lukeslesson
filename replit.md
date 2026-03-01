# AI Learning - Tutoring Platform

## Overview
A React/Vite + Express/Socket.io AI-powered tutoring app for sessions between instructor Aleixander Puerta and student Luke D'Amato. Uses Gemini AI for intelligent features.

## Architecture
- **Frontend**: React 19 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express + Socket.io on port 5000
- **AI**: Google Gemini 2.5 Flash via `@google/genai`
- **State**: React Context (`SessionContext`) with localStorage persistence
- **Realtime**: Socket.io for workspace collaboration (code, whiteboard, chat)

## Key Files
- `server.ts` — Express server with Socket.io, Vite middleware, code execution API, AI suggestions API
- `vite.config.ts` — Vite config with `.local`/`.cache` watch exclusions, HMR on shared server
- `src/context/SessionContext.tsx` — Shared state: goals, topics, topicOrder, homeworkStatus, completedActivities, sessionNotes. Persisted to localStorage.
- `src/lib/gemini.ts` — Lazy-initialized Gemini AI client
- `src/components/ErrorBoundary.tsx` — Catches render errors, shows retry UI
- `src/components/layout/MobileLayout.tsx` — App shell with header, nav, error boundary

## Data Flow
1. Luke enters goals in GoalEntry → saved to SessionContext
2. GoalBreakdown uses Gemini to generate topics → saved to context
3. TopicPreferences lets Luke prioritize topics → order saved to context
4. Instructor Dashboard/LessonPlan reads goals, topics, topicOrder from context
5. Homework page tracks assignments → updates homeworkStatus in context
6. SubmissionReview reads homework status, allows AI grading and feedback

## Socket.io Events
| Event | Direction | Purpose |
|---|---|---|
| `user:join` | Client → Server | Register with name/role |
| `users:update` | Server → All | Broadcast connected users list |
| `user:typing` | Client ↔ Server | Typing indicators in chat |
| `cursor:move` | Client ↔ Server | Cursor position sharing |
| `code:update` | Client ↔ Server | Code editor sync |
| `draw:sync` | Client ↔ Server | Whiteboard drawing sync |
| `chat:message` | Client ↔ Server | Chat messages (including @AI) |
| `workspace:save/load` | Client ↔ Server | Save/restore workspace state |

## Routes
**Student**: `/student/goal-entry`, `/student/goal-breakdown`, `/student/topic-preferences`, `/student/homework`, `/student/ai-assistant`
**Instructor**: `/instructor/login`, `/instructor/dashboard`, `/instructor/lesson-plan`, `/instructor/session-summary`, `/instructor/submission-review`, `/instructor/ai-assistant`
**Shared**: `/workspace`, `/resources`

## Environment
- `GEMINI_API_KEY` — Required for AI features (set as Replit secret)
- Port 5000 — Express serves both API and Vite frontend
- `vercel.json` — SPA rewrite rules for Vercel deployment
