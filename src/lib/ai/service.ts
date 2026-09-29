// CivicGrid — AI Provider Abstraction Layer
// Server-side only. Never import from client components.

import type { AIProvider, AITask, AIResult, AIProviderHealth, ReportAnalysisOutput } from "@/types";

// ============================================================
// PROVIDER INTERFACE
// ============================================================

export interface GenerateTextOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateStructuredOptions<T> {
  prompt: string;
  systemPrompt?: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}

export interface AnalyzeImageOptions {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  prompt: string;
}

export interface IAIProvider {
  readonly name: AIProvider;
  readonly model: string;
  generateText(options: GenerateTextOptions): Promise<string>;
  generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T>;
  analyzeImage(options: AnalyzeImageOptions): Promise<string>;
  isAvailable(): Promise<boolean>;
}

// ============================================================
// OPENAI PROVIDER
// ============================================================

class OpenAIProvider implements IAIProvider {
  readonly name: AIProvider = "openai";
  readonly model: string;

  constructor() {
    this.model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.OPENAI_API_KEY;
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(options.systemPrompt
            ? [{ role: "system", content: options.systemPrompt }]
            : []),
          { role: "user", content: options.prompt },
        ],
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.3,
      }),
      signal: AbortSignal.timeout(parseInt(process.env.AI_TIMEOUT_MS ?? "15000")),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AIProviderError(response.status, `OpenAI error: ${err}`, "openai");
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return json.choices[0]?.message?.content ?? "";
  }

  async generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              (options.systemPrompt ?? "") +
              "\nRespond ONLY with valid JSON matching the schema. No markdown, no explanation.",
          },
          { role: "user", content: options.prompt },
        ],
        max_tokens: options.maxTokens ?? 1024,
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(parseInt(process.env.AI_TIMEOUT_MS ?? "15000")),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AIProviderError(response.status, `OpenAI error: ${err}`, "openai");
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = json.choices[0]?.message?.content ?? "{}";
    return JSON.parse(content) as T;
  }

  async analyzeImage(options: AnalyzeImageOptions): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const imageContent = options.imageBase64
      ? {
          type: "image_url",
          image_url: {
            url: `data:${options.mimeType ?? "image/jpeg"};base64,${options.imageBase64}`,
          },
        }
      : { type: "image_url", image_url: { url: options.imageUrl! } };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: options.prompt },
              imageContent,
            ],
          },
        ],
        max_tokens: 512,
      }),
      signal: AbortSignal.timeout(parseInt(process.env.AI_TIMEOUT_MS ?? "15000")),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AIProviderError(response.status, `OpenAI error: ${err}`, "openai");
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return json.choices[0]?.message?.content ?? "";
  }
}

// ============================================================
// GEMINI PROVIDER
// ============================================================

class GeminiProvider implements IAIProvider {
  readonly name: AIProvider = "gemini";
  readonly model: string;

  constructor() {
    this.model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.GEMINI_API_KEY;
  }

  private async callGemini(
    contents: unknown[],
    maxTokens: number = 1024
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(parseInt(process.env.AI_TIMEOUT_MS ?? "15000")),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AIProviderError(response.status, `Gemini error: ${err}`, "gemini");
    }

    const json = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    return json.candidates[0]?.content?.parts[0]?.text ?? "";
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const prompt = options.systemPrompt
      ? `${options.systemPrompt}\n\n${options.prompt}`
      : options.prompt;
    return this.callGemini(
      [{ role: "user", parts: [{ text: prompt }] }],
      options.maxTokens
    );
  }

  async generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T> {
    const prompt =
      (options.systemPrompt ?? "") +
      "\nRespond ONLY with valid JSON. No markdown fences, no explanation.\n\n" +
      options.prompt;
    const text = await this.callGemini(
      [{ role: "user", parts: [{ text: prompt }] }],
      options.maxTokens
    );
    // Strip markdown fences if present
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(clean) as T;
  }

  async analyzeImage(options: AnalyzeImageOptions): Promise<string> {
    const imagePart = options.imageBase64
      ? {
          inlineData: {
            mimeType: options.mimeType ?? "image/jpeg",
            data: options.imageBase64,
          },
        }
      : { fileData: { mimeType: options.mimeType ?? "image/jpeg", fileUri: options.imageUrl } };

    return this.callGemini([
      { role: "user", parts: [{ text: options.prompt }, imagePart] },
    ]);
  }
}

// ============================================================
// OPENROUTER PROVIDER
// ============================================================

class OpenRouterProvider implements IAIProvider {
  readonly name: AIProvider = "openrouter";
  readonly model: string;

  constructor() {
    this.model =
      process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct";
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://civicgrid.in",
        "X-Title": "CivicGrid",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(options.systemPrompt
            ? [{ role: "system", content: options.systemPrompt }]
            : []),
          { role: "user", content: options.prompt },
        ],
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.3,
      }),
      signal: AbortSignal.timeout(parseInt(process.env.AI_TIMEOUT_MS ?? "15000")),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AIProviderError(response.status, `OpenRouter error: ${err}`, "openrouter");
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return json.choices[0]?.message?.content ?? "";
  }

  async generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T> {
    const text = await this.generateText({
      ...options,
      systemPrompt:
        (options.systemPrompt ?? "") +
        "\nRespond ONLY with valid JSON. No markdown, no explanation.",
    });
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(clean) as T;
  }

  async analyzeImage(_options: AnalyzeImageOptions): Promise<string> {
    throw new Error("Image analysis not supported by this OpenRouter model");
  }
}

// ============================================================
// GROQ PROVIDER
// ============================================================

class GroqProvider implements IAIProvider {
  readonly name: AIProvider = "groq";
  readonly model: string;

  constructor() {
    this.model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.GROQ_API_KEY;
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not configured");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(options.systemPrompt
            ? [{ role: "system", content: options.systemPrompt }]
            : []),
          { role: "user", content: options.prompt },
        ],
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.3,
      }),
      signal: AbortSignal.timeout(parseInt(process.env.AI_TIMEOUT_MS ?? "15000")),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AIProviderError(response.status, `Groq error: ${err}`, "groq");
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return json.choices[0]?.message?.content ?? "";
  }

  async generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T> {
    const text = await this.generateText({
      ...options,
      systemPrompt:
        (options.systemPrompt ?? "") +
        "\nRespond ONLY with valid JSON. No markdown, no explanation.",
    });
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(clean) as T;
  }

  async analyzeImage(_options: AnalyzeImageOptions): Promise<string> {
    throw new Error("Image analysis not supported by Groq text models");
  }
}

// ============================================================
// RULE-BASED FALLBACK PROVIDER
// ============================================================

class RuleBasedProvider implements IAIProvider {
  readonly name: AIProvider = "rule-based";
  readonly model: string = "deterministic-v1";

  async isAvailable(): Promise<boolean> {
    return true; // Always available
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    return `[AI Unavailable — Rule-based response] Analysis of: ${options.prompt.slice(0, 100)}...`;
  }

  async generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T> {
    // Return a minimal valid structure based on schema keys
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(options.schema)) {
      result[key] = null;
    }
    // Inject defaults for known output types
    return {
      category: "OTHER",
      severity: "MEDIUM",
      summary: "Manual review required — AI provider unavailable.",
      department: "MUNICIPAL",
      confidence: 0,
      recommendedAction: "Escalate to department officer for manual assessment.",
      factors: ["AI provider unavailable"],
      entities: {},
      ...result,
    } as T;
  }

  async analyzeImage(_options: AnalyzeImageOptions): Promise<string> {
    return "Image analysis unavailable — please review manually.";
  }
}

// ============================================================
// ERROR CLASS
// ============================================================

export class AIProviderError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly provider: AIProvider
  ) {
    super(message);
    this.name = "AIProviderError";
  }

  isRetryable(): boolean {
    // Retry on rate limit (429), server errors (5xx), timeout
    return (
      this.statusCode === 429 ||
      this.statusCode === 500 ||
      this.statusCode === 502 ||
      this.statusCode === 503 ||
      this.statusCode === 504 ||
      this.statusCode === 0 // timeout
    );
  }
}

// ============================================================
// PROVIDER REGISTRY
// ============================================================

const PROVIDER_MAP: Record<string, IAIProvider> = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
  openrouter: new OpenRouterProvider(),
  groq: new GroqProvider(),
};

const RULE_BASED_PROVIDER = new RuleBasedProvider();

function getProviderChain(): IAIProvider[] {
  const primary = process.env.AI_PRIMARY_PROVIDER ?? "openai";
  const fallbacks = (process.env.AI_FALLBACK_PROVIDERS ?? "gemini,openrouter,groq")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const chain: IAIProvider[] = [];

  const primaryProvider = PROVIDER_MAP[primary];
  if (primaryProvider) chain.push(primaryProvider);

  for (const fallback of fallbacks) {
    const provider = PROVIDER_MAP[fallback];
    if (provider && !chain.includes(provider)) {
      chain.push(provider);
    }
  }

  // Always add rule-based as last resort
  chain.push(RULE_BASED_PROVIDER);
  return chain;
}

// ============================================================
// EXPONENTIAL BACKOFF
// ============================================================

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// MAIN AI SERVICE — with failover
// ============================================================

const MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES ?? "2");

async function withFailover<T>(
  task: (provider: IAIProvider) => Promise<T>
): Promise<{ result: T; provider: IAIProvider; fallbackUsed: boolean }> {
  const chain = getProviderChain();
  let firstProvider: IAIProvider | null = null;
  let lastError: Error = new Error("No providers available");

  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i];
    const isFallback = i > 0;

    // Skip unavailable providers (no API key configured)
    if (!(await provider.isAvailable())) {
      continue;
    }

    if (!firstProvider) firstProvider = provider;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await task(provider);
        return { result, provider, fallbackUsed: isFallback };
      } catch (error) {
        lastError = error as Error;
        const isRetryable =
          error instanceof AIProviderError && error.isRetryable();

        if (!isRetryable || attempt === MAX_RETRIES - 1) break;

        // Exponential backoff
        await sleep(Math.pow(2, attempt) * 500);
      }
    }
  }

  throw lastError;
}

// ============================================================
// PUBLIC API — AI SERVICE
// ============================================================

export const aiService = {
  async generateText(
    options: GenerateTextOptions
  ): Promise<AIResult<string>> {
    const start = Date.now();
    const { result, provider, fallbackUsed } = await withFailover((p) =>
      p.generateText(options)
    );
    return {
      data: result,
      provider: provider.name,
      model: provider.model,
      latencyMs: Date.now() - start,
      cacheHit: false,
      fallbackUsed,
    };
  },

  async generateStructured<T>(
    options: GenerateStructuredOptions<T>
  ): Promise<AIResult<T>> {
    const start = Date.now();
    const { result, provider, fallbackUsed } = await withFailover((p) =>
      p.generateStructured<T>(options)
    );
    return {
      data: result,
      provider: provider.name,
      model: provider.model,
      latencyMs: Date.now() - start,
      cacheHit: false,
      fallbackUsed,
    };
  },

  async analyzeImage(
    options: AnalyzeImageOptions
  ): Promise<AIResult<string>> {
    const start = Date.now();
    // Only vision-capable providers for image analysis
    const visionChain: IAIProvider[] = [
      new OpenAIProvider(),
      new GeminiProvider(),
      RULE_BASED_PROVIDER,
    ].filter(async (p) => await p.isAvailable());

    let lastError: Error = new Error("No vision providers available");
    for (const provider of visionChain) {
      if (!(await provider.isAvailable())) continue;
      try {
        const result = await provider.analyzeImage(options);
        return {
          data: result,
          provider: provider.name,
          model: provider.model,
          latencyMs: Date.now() - start,
          cacheHit: false,
          fallbackUsed: provider.name !== visionChain[0]?.name,
        };
      } catch (error) {
        lastError = error as Error;
      }
    }
    throw lastError;
  },

  async analyzeReport(reportText: string, imageBase64?: string): Promise<AIResult<ReportAnalysisOutput>> {
    const systemPrompt = `You are a public infrastructure analysis AI for CivicGrid, a civic intelligence platform.
Analyze citizen reports about public infrastructure issues in Hyderabad, India.
Always respond with valid JSON only.`;

    const prompt = `Analyze this citizen report and categorize it:

Report: ${reportText}
${imageBase64 ? "An image has been attached." : ""}

Respond with JSON:
{
  "category": "ROAD|DRAINAGE|WASTE|STREETLIGHT|WATER|PUBLIC_BUILDING|PUBLIC_TRANSPORT|HEALTH|OTHER",
  "severity": "CRITICAL|HIGH|MEDIUM|LOW",
  "summary": "brief 1-sentence summary",
  "department": "department name",
  "confidence": 0.0-1.0,
  "recommendedAction": "specific action to take",
  "factors": ["factor1", "factor2"],
  "entities": {
    "location": "location mentioned",
    "infrastructure": "infrastructure type",
    "problem": "specific problem"
  }
}`;

    return this.generateStructured<ReportAnalysisOutput>({
      prompt,
      systemPrompt,
      schema: {
        category: "string",
        severity: "string",
        summary: "string",
        department: "string",
        confidence: "number",
        recommendedAction: "string",
        factors: "array",
        entities: "object",
      },
    });
  },
};
