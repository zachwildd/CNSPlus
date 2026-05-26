import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface GenerateRequest {
  prompt: string;
  system?: string;
  max_tokens?: number;
}

export async function generate({ prompt, system, max_tokens }: GenerateRequest) {

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: max_tokens ?? 16000,
    thinking: { type: "adaptive" },
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  const message = await stream.finalMessage();
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return text;
}