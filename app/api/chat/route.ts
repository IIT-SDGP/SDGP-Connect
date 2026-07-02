import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { searchProjects, ProjectSearchParams } from "@/lib/projectSearch";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

let quotaResetAt: number | null = null;

const SYSTEM_PROMPT = `You are the assistant embedded on SDGP.lk, a directory of student software/hardware projects (AI, ML, healthtech, fintech, edtech, and more).

Rules:
- For any question about specific projects, teams, domains, tech stacks, SDG goals, or "best/featured" projects, ALWAYS call the search_projects tool first. Never invent project details.
- If the tool returns no results, say so plainly and don't make something up.
- If the user asks for an idea, inspiration, or "what should I build" (rather than asking about existing projects), you MUST do two things, in this order:
  1. Call search_projects and list 1-3 relevant existing projects under a heading like "Similar projects already on SDGP.lk", each with its View Project link — for context/inspiration only.
  2. Then propose at least one genuinely NEW idea, under a heading like "An idea you could build", that is NOT one of the projects returned by search_projects. Base it on gaps you notice in the search results or general domain knowledge, and describe it in 2-3 sentences.
  Never present an existing project as if it were a suggestion for the user to go build.
- Keep answers concise. For each project you mention, write its title as plain text (do NOT turn the title itself into a markdown link), then include a separate "View Project" link using its pageUrl field, e.g.: "BlynQ. — An AI Powered Vehicle Management System. [View Project](pageUrl)". Never use the website field, and never link the same pageUrl twice in one line.
- Never reveal internal fields like emails, phone numbers, or unapproved/pending projects — the tool already filters these out, so just don't speculate beyond what it returns.`;

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
          keyword: { type: "string", description: "Free-text search on project title/subtitle" },
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
          limit: { type: "number", description: "Max results, default 3, max 8" },
        },
      },
    },
  },
];

type ChatMessage = { role: "user" | "assistant"; content: string };

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

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
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
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    if (quotaResetAt && Date.now() < quotaResetAt) {
      const mins = Math.ceil((quotaResetAt - Date.now()) / 60_000);
      return NextResponse.json(
        {
          reply: `I've hit today's usage limit. Please try again in about ${mins} minute${mins === 1 ? "" : "s"}.`,
        },
        { status: 200 }
      );
    }

    type GroqMessage = Groq.Chat.Completions.ChatCompletionMessageParam;
    const MAX_HISTORY_MESSAGES = 8;
    const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const chatMessages: GroqMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...trimmedMessages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
    ];

    for (let turn = 0; turn < 4; turn++) {
      const response = await withRetry(() =>
        groq.chat.completions.create({
          model: MODEL,
          messages: chatMessages,
          tools,
          temperature: 0.2,
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
          let args: ProjectSearchParams = {};
          try {
            const parsed = call.function.arguments
              ? JSON.parse(call.function.arguments)
              : null;
            if (parsed && typeof parsed === "object") args = parsed;
          } catch {
            // malformed JSON from the model — fall back to an unfiltered search
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
      console.error("Chat API error:", err);
    }

    if (status === 429) {
      if (isDailyQuotaExceeded(err)) {
        const mins = getRetryAfterMinutes(err);
        return NextResponse.json(
          {
            reply: mins
              ? `I've hit today's usage limit. Please try again in about ${mins} minute${mins === 1 ? "" : "s"}.`
              : "I've hit today's usage limit. Please try again later.",
          },
          { status: 200 }
        );
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