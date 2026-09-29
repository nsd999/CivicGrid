# CivicGrid Data Sources & Integrations

CivicGrid relies on a hybrid data ingestion model, combining active citizen reporting with passive sensor and API data to form a comprehensive operational picture.

## Primary Data Sources

### 1. Citizen Reports (UGC)
- **Mechanism**: Submitted via the CivicGrid public portal or mobile interface.
- **Data Points**: Geolocation, text description, media (images), category selection.
- **Handling**: Processed via AI for validation, categorization, and initial priority scoring.

### 2. Departmental Inputs
- **Mechanism**: Entered by field workers or department officers via dashboard forms.
- **Data Points**: Status updates, action logs, resource availability (e.g., hospital beds, pump status).
- **Handling**: Serves as ground-truth for operational state.

## External APIs & Integrations

### 1. Geospatial Data
- **Provider**: Google Maps Platform (`@vis.gl/react-google-maps`)
- **Usage**: Map rendering, geocoding, reverse geocoding, spatial clustering, and routing.

### 2. Weather & Environmental Data (Planned)
- **Providers**: OpenWeatherMap, IMD (India Meteorological Department) RSS/APIs, Air Quality APIs.
- **Usage**: Feeds into `MonsoonShield` and `HeatSafe India` for predictive risk analysis and threshold alerts.

### 3. Public Health Data (Planned/Simulated)
- **Usage**: Feeds into `SwasthyaGrid` for epidemiological mapping and supply chain visibility. Currently relies on structured demo datasets.

## Data Models (Prisma)

- **`CitizenReport`**: Core entity for tracking issues.
- **`DataSource`**: Represents an external feed or sensor.
- **`Mission`**: Aggregates multiple reports and data sources into a coordinated operation.
- **`Asset` / `Resource`**: Tracks physical infrastructure (e.g., pumps, shelters, medical supplies).

## Data Integrity & Security

- **Demo Data Separation**: All synthetic or demonstration data must be clearly tagged in the database or UI (e.g., `⚠️ DEMO DATA`).
- **Validation**: Incoming data streams are validated using Zod schemas before database insertion.
- **PII Protection**: Citizen identifying information is isolated and access-restricted based on RBAC roles.
