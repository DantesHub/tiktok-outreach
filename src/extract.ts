import OpenAI from "openai";

const openai = new OpenAI({ timeout: 45_000 });

interface ExtractResult {
  firstName: string;
  email: string;
}

export async function extractFromScreenshot(base64Image: string): Promise<ExtractResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You extract contact info from TikTok profile screenshots. Return JSON with:
- "email": the email address visible in the bio. If none found, return null.
- "firstName": the creator's first name from their display name. Normalize it:
  - Fix repeated letters (e.g. "Johnnnn" → "John", "Emmmaaa" → "Emma")
  - Capitalize properly (e.g. "sarah" → "Sarah")
  - Strip emojis and special characters
  - Use only the first name, not full name
  - If the display name is not a sensical real first name (e.g. it's a brand name, random characters, or gibberish), use the TikTok username instead (the text after the @ symbol, without the @).

Return ONLY valid JSON: { "email": "...", "firstName": "..." }`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/png;base64,${base64Image}`, detail: "low" },
          },
        ],
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No response from GPT-4o");

  const parsed = JSON.parse(text) as { email: string | null; firstName: string | null };

  if (!parsed.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email)) {
    throw new Error("No valid email found in screenshot");
  }

  if (!parsed.firstName) {
    throw new Error("Could not extract creator name");
  }

  return { firstName: parsed.firstName, email: parsed.email };
}
