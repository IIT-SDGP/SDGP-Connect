// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { searchProjects, ProjectSearchParams } from "@/lib/projectSearch";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  groq,
  MODEL,
  SYSTEM_PROMPT,
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGES,
  MAX_MESSAGE_LENGTH,
  MAX_USER_MESSAGE_LENGTH,
  MAX_COMPLETION_TOKENS,
  QUOTA_EXCEEDED_MESSAGE,
  RATE_LIMIT_MESSAGE,
  CHAT_RATE_LIMIT_RULES,
} from "@/lib/constants/groq";

let quotaResetAt: number | null = null;

const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_projects",
      description:
        "Search approved student projects on SDGP.lk by keyword, domain, tech stack, SDG goal, project type, status, or featured flag.",
      parameters: {
        type: "object",
        properties: {
          keyword: { type: "string", description: "Free-text search on project title, subtitle, and description" },
          domain: {
            type: "string",
            enum: [
              "AI", "ML", "AR_VR", "BLOCKCHAIN", "IOT", "HEALTHTECH", "FINTECH",
              "EDTECH", "AGRITECH", "ECOMMERCE", "SOCIAL", "GAMING", "SECURITY",
              "DATA_ANALYTICS", "ENTERTAINMENT", "SUSTAINABILITY",
            ],
          },
          techStack: { type: "string", description: "One of the TechStackEnum values, e.g. REACT, PYTHON, TENSORFLOW" },
          projectType: { type: "string", enum: ["MOBILE", "WEB", "HARDWARE", "DESKTOP", "WEARABLE", "EXTENSION"] },
          sdgGoal: { type: "string", description: "One of the SDGGoalEnum values, e.g. GOOD_HEALTH, CLIMATE_ACTION" },
          status: { type: "string", enum: ["IDEA", "MVP", "RESEARCH", "DEPLOYED", "STARTUP"] },
          featuredOnly: { type: "boolean", description: "Set true when the user asks for 'best' or 'featured' projects" },
          limit: { type: "number", description: "Max results to preview, default 3, max 3 — use showMoreUrl for anything beyond this" },
        },
      },
    },
  },
];

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValidChatMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const { role, content } = m as Record<string, unknown>;
  if (role !== "user" && role !== "assistant") return false;
  if (typeof content !== "string" || content.trim().length === 0) return false;
  const maxLength = role === "user" ? MAX_USER_MESSAGE_LENGTH : MAX_MESSAGE_LENGTH;
  return content.length <= maxLength;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

interface GroqErrorShape {
  status?: number;
  headers?: Headers;
  error?: {
    error?: {
      code?: string;
      message?: string;
      type?: string;
    };
  };
}

function toGroqErrorShape(err: unknown): GroqErrorShape {
  return typeof err === "object" && err !== null ? (err as GroqErrorShape) : {};
}

function isDailyQuotaExceeded(err: unknown): boolean {
  const { error } = toGroqErrorShape(err);
  const message = error?.error?.message ?? "";
  return error?.error?.type === "tokens" && /tokens per day|TPD/i.test(message);
}

function getRetryAfterMinutes(err: unknown): number | null {
  const { headers } = toGroqErrorShape(err);
  const raw = headers?.get?.("retry-after");
  if (!raw) return null;
  const seconds = Number(raw);
  if (Number.isNaN(seconds)) return null;
  return Math.ceil(seconds / 60);
}

async function withRetry<T>(fn: (attempt: number) => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (isDailyQuotaExceeded(err)) {
        const mins = getRetryAfterMinutes(err);
        if (mins) quotaResetAt = Date.now() + mins * 60_000;
        console.warn(`[groq] daily token quota exhausted, resets in ~${mins ?? "?"} min`);
        throw err;
      }

      const { status, error } = toGroqErrorShape(err);
      const code = error?.error?.code;
      const isTransient = status === 503 || status === 429 || code === "tool_use_failed";
      if (!isTransient || attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 400 * 2 ** attempt));
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(getClientIp(req), CHAT_RATE_LIMIT_RULES);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { reply: RATE_LIMIT_MESSAGE },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { messages } = (body ?? {}) as { messages?: unknown };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: "Too many messages." }, { status: 400 });
    }

    if (!messages.every(isValidChatMessage)) {
      return NextResponse.json(
        { error: "Each message must have a role of 'user' or 'assistant' and non-empty string content." },
        { status: 400 }
      );
    }

    if (messages[messages.length - 1].role !== "user") {
      return NextResponse.json(
        { error: "The last message must be from the user." },
        { status: 400 }
      );
    }

    if (quotaResetAt && Date.now() < quotaResetAt) {
      const mins = Math.ceil((quotaResetAt - Date.now()) / 60_000);
      console.warn(`[groq] blocked request, daily quota resets in ~${mins} min`);
      return NextResponse.json({ reply: QUOTA_EXCEEDED_MESSAGE }, { status: 200 });
    }

    type GroqMessage = Groq.Chat.Completions.ChatCompletionMessageParam;
    const trimmedMessages = (messages as ChatMessage[]).slice(-MAX_HISTORY_MESSAGES);

    const chatMessages: GroqMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...trimmedMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    for (let turn = 0; turn < 4; turn++) {
      const response = await withRetry((attempt) =>
        groq.chat.completions.create({
          model: MODEL,
          messages: chatMessages,
          tools,
          temperature: 0.2,
          max_completion_tokens: MAX_COMPLETION_TOKENS,
          ...(attempt > 0
            ? { tool_choice: { type: "function", function: { name: "search_projects" } } as const }
            : {}),
        })
      );

      const choice = response.choices[0];
      console.log(
        `[groq usage] turn ${turn} — prompt: ${response.usage?.prompt_tokens}, completion: ${response.usage?.completion_tokens}, total: ${response.usage?.total_tokens}`
      );
      const toolCalls = choice.message.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        return NextResponse.json({ reply: choice.message.content ?? "" });
      }

      chatMessages.push(choice.message);

      for (const call of toolCalls) {
        if (call.function.name === "search_projects") {
          let args: ProjectSearchParams | null = null;
          try {
            const parsed = call.function.arguments
              ? JSON.parse(call.function.arguments)
              : {};
            if (parsed && typeof parsed === "object") args = parsed;
          } catch {
            console.warn(
              "search_projects: malformed tool-call arguments from model:",
              call.function.arguments
            );
          }

          if (args === null) {
            chatMessages.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify({
                error: "Invalid arguments: could not parse as JSON. Retry the call with valid JSON arguments.",
              }),
            });
            continue;
          }

          console.log("search_projects called with:", args);
          const results = await searchProjects(args);
          chatMessages.push({
            role: "tool",
            tool_call_id: call.id,
            content: JSON.stringify(results),
          });
        }
      }
    }

    return NextResponse.json({ reply: "Sorry, I couldn't complete that request." });
  } catch (err) {
    const { status, error } = toGroqErrorShape(err);
    const code = error?.error?.code;
    if (!(status === 429 && isDailyQuotaExceeded(err))) {
      console.error(
        "Chat API error:",
        status ?? "no-status",
        code ?? "no-code",
        error?.error?.message ?? (err instanceof Error ? err.message : String(err))
      );
    }

    if (status === 429) {
      if (isDailyQuotaExceeded(err)) {
        const mins = getRetryAfterMinutes(err);
        console.warn(`[groq] daily quota exceeded, resets in ~${mins ?? "?"} min`);
        return NextResponse.json({ reply: QUOTA_EXCEEDED_MESSAGE }, { status: 200 });
      }
      return NextResponse.json(
        { reply: "I'm getting a lot of questions right now. Please try again in a bit." },
        { status: 200 }
      );
    }
    if (status === 503) {
      return NextResponse.json(
        { reply: "The AI service is overloaded right now. Please try again in a moment." },
        { status: 200 }
      );
    }
    if (code === "tool_use_failed") {
      return NextResponse.json(
        { reply: "I had trouble processing that — could you rephrase your question?" },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}