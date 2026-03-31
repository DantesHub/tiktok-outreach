import OpenAI from "openai";

const openai = new OpenAI({ timeout: 45_000 });
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const prompt = `You extract contact info from TikTok profile screenshots. Return JSON with:
- "email": the email address visible in the bio. If none found, return null.
- "firstName": the creator's first name from their display name. Normalize it:
  - Fix repeated letters (e.g. "Johnnnn" → "John", "Emmmaaa" → "Emma")
  - Capitalize properly (e.g. "sarah" → "Sarah")
  - Strip emojis and special characters
  - Use only the first name, not full name
  - If the display name is not a sensical real first name (e.g. it's a brand name, random characters, or gibberish), use the TikTok username instead (the text after the @ symbol, without the @).

Return ONLY valid JSON: { "email": "...", "firstName": "..." }`;

interface ExtractResult {
  firstName: string;
  email: string;
}

function parseResult(rawText: string, provider: string): ExtractResult {
  const trimmed = rawText.trim();
  const jsonText =
    trimmed.startsWith("{") && trimmed.endsWith("}")
      ? trimmed
      : (trimmed.match(/\{[\s\S]*\}/)?.[0] ?? null);

  if (!jsonText) {
    throw new Error(`${provider} did not return JSON`);
  }

  const parsed = JSON.parse(jsonText) as { email: string | null; firstName: string | null };

  if (!parsed.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.email)) {
    throw new Error("No valid email found in screenshot");
  }

  if (!parsed.firstName) {
    throw new Error("Could not extract creator name");
  }

  return { firstName: parsed.firstName, email: parsed.email };
}

async function extractWithAnthropic(base64Image: string): Promise<ExtractResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 300,
      system: prompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract email + firstName and return JSON only." },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${body}`);
  }

  const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> };
  const text = (data.content ?? [])
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text as string)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("No response from Anthropic");
  }

  return parseResult(text, "Anthropic");
}

async function extractWithOpenAI(base64Image: string): Promise<ExtractResult> {
  const response = await openai.chat.completions.create({
    model: openaiModel,
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/png;base64,${base64Image}`, detail: "high" },
          },
        ],
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("No response from OpenAI");
  }

  return parseResult(text, "OpenAI");
}

export async function extractFromScreenshot(base64Image: string): Promise<ExtractResult> {
  try {
    console.log(`Trying Anthropic (${anthropicModel})...`);
    return await extractWithAnthropic(base64Image);
  } catch (anthropicErr) {
    const anthropicMessage =
      anthropicErr instanceof Error ? anthropicErr.message : String(anthropicErr);

    if (process.env.DISABLE_OPENAI_FALLBACK === "true") {
      throw new Error(`Anthropic failed and OpenAI fallback is disabled: ${anthropicMessage}`);
    }

    console.warn(
      `Anthropic failed. Falling back to OpenAI (${openaiModel}): ${anthropicMessage}`
    );

    try {
      return await extractWithOpenAI(base64Image);
    } catch (openaiErr) {
      const openaiMessage = openaiErr instanceof Error ? openaiErr.message : String(openaiErr);
      throw new Error(
        `Anthropic failed first: ${anthropicMessage} | OpenAI fallback failed: ${openaiMessage}`
      );
    }
  }
}
