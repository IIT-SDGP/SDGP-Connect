import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { searchProjects, ProjectSearchParams } from "@/lib/projectSearch";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are the assistant embedded on SDGP.lk, a directory of student software/hardware projects (AI, ML, healthtech, fintech, edtech, and more).

Rules:
- For any question about specific projects, teams, domains, tech stacks, SDG goals, or "best/featured" projects, ALWAYS call the search_projects tool first. Never invent project details.
- If the tool returns no results, say so plainly and don't make something up.
- For open-ended or advice questions (e.g. "what AI or medical project should I build?"), you may combine real examples from search_projects with your own general knowledge to suggest ideas — but clearly distinguish "here's what's already on SDGP.lk" from "here's an idea you could build."
- Keep answers concise and link to the project's website field when available.
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
          limit: { type: "number", description: "Max results, default 5, max 10" },
        },
      },
    },
  },
];

type ChatMessage = { role: "user" | "assistant"; content: string };

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = (err as { status?: number })?.status;
      const isTransient = status === 503 || status === 429;
      if (!isTransient || attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chatMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
    ];

    for (let turn = 0; turn < 4; turn++) {
      const response = await withRetry(() =>
        groq.chat.completions.create({
          model: MODEL,
          messages: chatMessages,
          tools,
        })
      );

      const choice = response.choices[0];
      const toolCalls = choice.message.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        return NextResponse.json({ reply: choice.message.content ?? "" });
      }

      chatMessages.push(choice.message);

      for (const call of toolCalls) {
        if (call.function.name === "search_projects") {
          const args = JSON.parse(call.function.arguments) as ProjectSearchParams;
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
    console.error("Chat API error:", err);
    const status = (err as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json(
        { reply: "I'm getting a lot of questions right now and hit today's free usage limit. Please try again in a bit." },
        { status: 200 }
      );
    }
    if (status === 503) {
      return NextResponse.json(
        { reply: "The AI service is overloaded right now. Please try again in a moment." },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}