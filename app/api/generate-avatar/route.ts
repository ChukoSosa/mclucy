import { NextRequest, NextResponse } from "next/server";
import https from "node:https";
import { isMissionControlDemoMode, demoReadOnlyResponse } from "@/app/api/server/demo-mode";

// Use node:https directly so we can disable certificate verification for
// environments with corporate SSL inspection proxies.
function httpsPost(
  hostname: string,
  path: string,
  headers: Record<string, string>,
  body: string,
): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname,
      path,
      method: "POST",
      headers: { ...headers, "Content-Length": Buffer.byteLength(body) },
      rejectUnauthorized: false,
    };
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () =>
        resolve({ status: res.statusCode ?? 0, text: Buffer.concat(chunks).toString("utf8") }),
      );
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function httpsGet(url: string): Promise<{ contentType: string; buffer: Buffer }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options: https.RequestOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "GET",
      rejectUnauthorized: false,
    };
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () =>
        resolve({
          contentType: res.headers["content-type"] ?? "image/png",
          buffer: Buffer.concat(chunks),
        }),
      );
    });
    req.on("error", reject);
    req.end();
  });
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<string> {
  const envModel = process.env.GEMINI_IMAGE_MODEL;
  const candidateModels = envModel
    ? [envModel]
    : [
        "gemini-2.0-flash-preview-image-generation",
        "gemini-2.0-flash-exp-image-generation",
        "gemini-2.5-flash-image-preview",
        "gemini-2.0-flash",
      ];

  const errors: string[] = [];

  for (const model of candidateModels) {
    const reqBody = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const { status, text } = await httpsPost(
      "generativelanguage.googleapis.com",
      `/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      { "Content-Type": "application/json" },
      reqBody,
    );

    if (status < 200 || status >= 300) {
      errors.push(`${model}: ${status}`);
      continue;
    }

    try {
      const parsed = JSON.parse(text) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{
              inlineData?: { mimeType?: string; data?: string };
              text?: string;
            }>;
          };
        }>;
      };

      for (const candidate of parsed.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType ?? "image/png";
            return `data:${mimeType};base64,${part.inlineData.data}`;
          }
        }
      }

      errors.push(`${model}: no inline image in response`);
    } catch {
      errors.push(`${model}: invalid JSON`);
    }
  }

  throw new Error(`Gemini generation failed (${errors.join(", ")})`);
}

async function generateWithOpenAI(prompt: string, apiKey: string): Promise<string> {
  const reqBody = JSON.stringify({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    response_format: "url",
  });

  const { status, text } = await httpsPost(
    "api.openai.com",
    "/v1/images/generations",
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    reqBody,
  );

  if (status < 200 || status >= 300) {
    throw new Error(`OpenAI error ${status}: ${text}`);
  }

  const parsed = JSON.parse(text) as { data?: { url?: string }[] };
  const imageUrl = parsed.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("OpenAI returned no image URL");
  }

  const { contentType, buffer } = await httpsGet(imageUrl);
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  if (isMissionControlDemoMode()) {
    return demoReadOnlyResponse();
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!geminiApiKey && !openAiApiKey) {
    return NextResponse.json(
      { error: "Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured" },
      { status: 500 },
    );
  }

  let prompt: string;
  try {
    const body = await req.json();
    prompt = String(body.prompt ?? "").slice(0, 4000).trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  let geminiError: string | null = null;
  if (geminiApiKey) {
    try {
      const avatarUrl = await generateWithGemini(prompt, geminiApiKey);
      return NextResponse.json({ avatarUrl, provider: "gemini" });
    } catch (error) {
      geminiError = error instanceof Error ? error.message : "Gemini generation failed";
    }
  }

  if (openAiApiKey) {
    try {
      const avatarUrl = await generateWithOpenAI(prompt, openAiApiKey);
      return NextResponse.json({ avatarUrl, provider: "openai", geminiError });
    } catch (error) {
      const openAiError = error instanceof Error ? error.message : "OpenAI generation failed";
      return NextResponse.json(
        { error: geminiError ? `${geminiError}; ${openAiError}` : openAiError },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ error: geminiError ?? "Avatar generation failed" }, { status: 500 });
}
