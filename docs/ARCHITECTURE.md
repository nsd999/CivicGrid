# CivicGrid Architecture

## Overview
CivicGrid is a Next.js (App Router) based application designed as a public intelligence and action platform. It integrates citizen reporting, field operations, AI analysis, and multi-domain public sector modules into a unified operational workflow.

## Technology Stack
- **Framework**: Next.js 16.3.6 (App Router) with React 19.2.8
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Component Library**: Shadcn UI (Radix UI primitives)
- **Database**: PostgreSQL (via Prisma ORM 5.22.0)
- **Authentication**: NextAuth.js (v5 beta)
- **State Management**: Zustand
- **GIS/Mapping**: `@vis.gl/react-google-maps` (Google Maps Platform)
- **AI Integrations**: OpenAI, Google Gemini, OpenRouter, Groq
- **Validation**: Zod
- **Deployment**: Vercel

## Core Architecture Layers

### 1. Frontend Layer
- **App Router (`src/app`)**: Contains all page routes, divided into public facing routes (`/login`, `/`) and protected operational dashboard routes (`/dashboard/*`).
- **Components (`src/components`)**: 
  - `ui/`: Reusable, accessible UI elements based on Shadcn UI.
  - `map/`: Geospatial and mapping components leveraging Google Maps.
  - `layout/`: App layout shells, sidebars, navigation.

### 2. Backend / API Layer
- **Route Handlers (`src/app/api`)**: Expose REST endpoints for third-party integrations and client-side data fetching where necessary.
- **Server Actions**: Preferred method for handling mutations, database writes, and server-side logic directly from React components.

### 3. Database Layer (`src/lib/db`)
- Managed via Prisma (`prisma/schema.prisma`).
- Connects to a PostgreSQL instance.
- Employs strict schemas with foreign key relations for Entities such as Profiles, Assets, Reports, Events, and Actions.
- Includes UUIDs for secure ID generation and avoids exposing incrementing integers.

### 4. Authentication & RBAC (`src/lib/auth`)
- **NextAuth.js**: Handles sessions and OIDC/credentials.
- **Roles**: `CITIZEN`, `FIELD_WORKER`, `DEPARTMENT_OFFICER`, `DISTRICT_OFFICER`, `ADMINISTRATOR`.
- **Authorization**: Middleware and Server Actions explicitly check the user's role before processing reads or mutations.

### 5. AI Layer (`src/lib/ai`)
- Centralized `AIProvider` interface.
- Supports multiple backends (OpenAI, Gemini, OpenRouter, Groq) via a unified `AIRequestRouter`.
- Includes fallback logic and deterministic degradation if all providers fail.
- All AI processing occurs server-side to prevent API key exposure and manipulation.

### 6. Modules
The application is structured into domain-specific modules that can operate independently but correlate data centrally:
- **CivicGrid Core**: Public infrastructure & citizen priorities.
- **SwasthyaGrid**: Public health & supply operations.
- **SurakshaGrid**: Disaster & vulnerability mapping.
- **MonsoonShield**: Flood & heavy rain intelligence.
- **HeatSafe India**: Extreme heat risk tracking.
- **Mission Mode**: Cross-domain correlation orchestrating multi-module responses.

## Security & Observability
- All API keys remain server-side.
- Database access is abstracted via Prisma.
- Audit logs capture every state change, AI recommendation, and human approval.
- Rate limiting and input validation (Zod) protect all endpoints.
