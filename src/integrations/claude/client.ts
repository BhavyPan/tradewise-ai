export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are TradeWise AI, a helpful stock trading assistant. You provide educational analysis about stocks, market trends, and trading strategies.

Guidelines:
- Always clarify that your advice is for educational purposes only, not financial advice
- When discussing stocks, mention that past performance does not guarantee future results
- Be clear and concise in your explanations
- If you don't know something, say so honestly
- You can discuss stock fundamentals, technical analysis concepts, and general market observations
- Never recommend specific buy/sell timing with certainty
- Be helpful for users who are learning about investing`;

export async function createChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === "gsk_REPLACE_WITH_YOUR_KEY") {
    throw new Error("VITE_GROQ_API_KEY is not set. Please add your Groq API key to the .env file.");
  }

  const openaiMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...openaiMessages],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    let errorMsg = `API request failed: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errorMsg = errorData.error.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
