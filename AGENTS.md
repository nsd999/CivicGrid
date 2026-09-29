# CIVICGRID AGENT INSTRUCTIONS

You are working on CivicGrid, a public-sector AI intelligence and action platform.

## Project Overview

CivicGrid is a unified platform with five domain modules:
1. **CivicGrid Core** — Public infrastructure and citizen priorities
2. **SwasthyaGrid** — Public health operations and supply resilience
3. **SurakshaGrid** — Disaster and critical-infrastructure vulnerability
4. **MonsoonShield** — Flood, heavy-rain and drainage intelligence
5. **HeatSafe India** — Extreme-heat and heat-health risk intelligence

## Priority Order

1. Correctness
2. Security
3. Reliability
4. Performance
5. Accessibility
6. Maintainability
7. Visual polish

Never sacrifice security or correctness for visual effects.

## Core Rules

- Inspect before modifying.
- Reuse existing architecture.
- Do not rewrite working features unnecessarily.
- Never expose secrets.
- Never hardcode API keys.
- Never fabricate government data.
- Never claim government affiliation.
- Never trust client-side authorization.
- Validate all AI output.
- Handle AI failure gracefully.
- Keep AI providers interchangeable.
- Keep core functionality usable without AI.

## AI Rules

Primary provider: OpenAI
Fallback: Gemini → OpenRouter → Groq

The exact provider order must be configurable via environment variables.

**NEVER** directly call a provider from UI components.

Correct architecture:
```
UI
↓
Application service
↓
AI service
↓
Provider adapter
↓
Provider API
```

All provider failures must be handled.
Retry only transient failures.
Never retry indefinitely.
Use timeouts.
Use exponential backoff.
Log failures without logging secrets.

## Security Rules

API keys belong only in server-side environment variables.

Never expose:
- OPENAI_API_KEY
- GEMINI_API_KEY
- OPENROUTER_API_KEY
- GROQ_API_KEY

Never commit `.env.local`.

## Data Rules

All demo data must be clearly labelled **⚠️ DEMO DATA**.
Never present synthetic data as actual government data.
Never invent government statistics.

## UX Rules

The application should feel:
- Official
- Trustworthy
- Lightweight
- Accessible
- Professional
- Indian public-service oriented

Avoid:
- Neon
- Gaming aesthetics
- Excessive gradients
- Excessive glassmorphism
- Unnecessary animations

## AI Decision Protocol

```
AI recommends
↓
Human reviews
↓
Approval
↓
Action
```

For consequential public-service actions, always require human approval.

## File Structure

```
src/
  app/              # Next.js App Router pages
  components/       # Reusable UI components
  lib/              # Core libraries
    ai/             # AI provider abstraction
    db/             # Database layer (Prisma)
    auth/           # Authentication utilities
    priority/       # Priority engine
    risk/           # Risk engine
  services/         # Business logic services
  types/            # TypeScript types
  hooks/            # React hooks
  store/            # Zustand stores (minimal)
  data/             # Demo data (clearly labelled)
prisma/
  schema.prisma     # Database schema
```

## Before Completion

Run:
1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`

Then inspect:
- authentication
- authorization
- AI fallback
- mobile layout
- error states
- loading states
- empty states
- security
- performance

Do not declare the project finished until critical paths work.

## Important Notes

- This is NOT an official Government of India application
- Always use: "Prototype", "Public-sector technology concept", "Designed for future government integration"
- Demo credentials must be clearly labelled
- All demo data must use `⚠️ DEMO DATA` label
