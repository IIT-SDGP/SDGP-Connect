// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { systemPrompt } from '@/components/ai/SystemPrompt';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GROQ_API_KEY ;
const model = process.env.GROQ_MODEL || 'deepseek-r1-distill-llama-70b';



export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not set' }, { status: 500 });
  }

  const clientKey = req.headers.get("x-api-key");
  const expectedKey = process.env.NEXT_PUBLIC_AI_API_KEY;

if (!clientKey || clientKey !== expectedKey) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

 // Filter out any user-injected "system" role messages
  const filteredMessages = Array.isArray(messages)
    ? messages.filter((msg: any) => msg.role !== "system")
    : [];


  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...filteredMessages,
      ],
      stream: false,
      
    }),
  });

  if (!groqRes.ok) {
    const error = await groqRes.text();
    return NextResponse.json({ error }, { status: groqRes.status });
  }

  const data = await groqRes.json();
  return NextResponse.json(data);
}
