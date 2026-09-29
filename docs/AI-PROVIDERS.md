# CivicGrid AI Providers

CivicGrid uses a multi-provider, fallback-capable AI architecture to ensure resilience, cost-control, and continuous availability.

## Architecture

The system abstracts AI models behind a centralized `AIRequestRouter`. Browser components NEVER call AI APIs directly. All AI interactions occur securely server-side.

### Supported Providers
- **OpenAI** (Primary)
- **Google Gemini** (Fallback 1)
- **OpenRouter** (Fallback 2)
- **Groq** (Fallback 3)

## Provider Details

### 1. OpenAI
- **Role**: Primary provider for complex reasoning, classification, and structuring.
- **Environment Variables**:
  - `OPENAI_API_KEY`: Secret key (server-side only)
  - `OPENAI_MODEL`: e.g., `gpt-4o-mini`
- **Capabilities**: Text generation, structured JSON output, vision.

### 2. Google Gemini
- **Role**: First fallback provider.
- **Environment Variables**:
  - `GEMINI_API_KEY`: Secret key (server-side only)
  - `GEMINI_MODEL`: e.g., `gemini-1.5-flash`
- **Capabilities**: Highly capable multimodal analysis, fast inference.

### 3. OpenRouter
- **Role**: Secondary fallback, providing access to diverse open-source and proprietary models.
- **Environment Variables**:
  - `OPENROUTER_API_KEY`: Secret key (server-side only)
  - `OPENROUTER_MODEL`: e.g., `meta-llama/llama-3.1-8b-instruct`
- **Capabilities**: Universal API access, allowing rapid switching between models like Llama 3 or Claude if necessary.

### 4. Groq
- **Role**: Tertiary fallback, utilized for ultra-fast, low-latency open-source model inference.
- **Environment Variables**:
  - `GROQ_API_KEY`: Secret key (server-side only)
  - `GROQ_MODEL`: e.g., `llama-3.1-8b-instant`
- **Capabilities**: High-speed Llama processing for straightforward classification tasks.

## Fallback & Resilience Behavior

If a provider fails due to timeout, rate limits (429), or server errors (500), the `AIRequestRouter` automatically fails over to the next provider in the chain defined by `AI_FALLBACK_PROVIDERS`.

### Deterministic Fallback
If ALL AI providers fail, or if the AI service is disabled (`ENABLE_AI=false`), the system gracefully degrades to a **Deterministic Fallback** mechanism. This rule-based engine calculates priorities and classifications based on structured data (e.g., keyword matching, geographic proximity to critical infrastructure) without relying on generative models. The UI will explicitly label such results as "Rule-based assessment."

## Security & Observability

- **No Secrets in Client**: API keys are never prefixed with `NEXT_PUBLIC_`.
- **Validation**: All AI output is parsed and validated against Zod schemas before being used or stored.
- **Health Tracking**: The `ai_provider_health` database table tracks the operational status, latency, and success rates of each provider, temporarily placing failing providers on cooldown to prevent cascading failures.
