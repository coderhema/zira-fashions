import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface RLE { count: number; windowStart: number; }
const WINDOW = 60 * 60 * 1000, MAX = 3;
const rl = new Map<string, RLE>();

function checkRL(ip: string) {
  const now = Date.now(), e = rl.get(ip);
  if (!e || now - e.windowStart > WINDOW) { rl.set(ip, { count: 1, windowStart: now }); return { allowed: true, remaining: MAX - 1 }; }
  if (e.count >= MAX) return { allowed: false, remaining: 0 };
  e.count++;
  return { allowed: true, remaining: MAX - e.count };
}

function prune() {
  const now = Date.now();
  for (const [k, v] of rl) if (now - v.windowStart > WINDOW) rl.delete(k);
}

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

const MAX_BYTES = 10 * 1024 * 1024;
const OK_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"]);

function buildPrompt(name: string): string {
  return `You are a professional fashion virtual try-on system.\n\nTwo images provided:\n1. A photo of a person\n2. Fashion item: "${name}"\n\nCreate a photorealistic composite of the person wearing the item.\n\nPRESERVE EXACTLY: face, expression, skin tone, hair, body proportions, background, lighting, shadows, pose.\nCHANGE: Replace their clothing with the garment. Fit naturally. Maintain garment color/fabric/texture/pattern.\nOUTPUT: Photorealistic photograph quality. No illustration. No artifacts or seams.`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  prune();
  const ip = getIp(req);
  const { allowed, remaining } = checkRL(ip);
  if (!allowed) return NextResponse.json(
    { error: "Try-on limit reached. Try again in an hour." },
    { status: 429, headers: { "Retry-After": "3600" } }
  );

  let fd: FormData;
  try { fd = await req.formData(); }
  catch { return NextResponse.json({ error: "Invalid form data." }, { status: 400 }); }

  const personFile  = fd.get("personImage") as File | null;
  const garmentUrl  = fd.get("garmentUrl")  as string | null;
  const garmentName = fd.get("garmentName") as string | null;

  if (!personFile || !(personFile instanceof File))
    return NextResponse.json({ error: "personImage required." }, { status: 400 });
  if (!garmentUrl)
    return NextResponse.json({ error: "garmentUrl required." }, { status: 400 });

  const mime = personFile.type || "image/jpeg";
  if (!OK_MIME.has(mime))
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  if (personFile.size > MAX_BYTES)
    return NextResponse.json({ error: "Photo too large (max 10MB)." }, { status: 400 });

  const personB64 = Buffer.from(await personFile.arrayBuffer()).toString("base64");

  let garmentB64: string, garmentMime = "image/jpeg";
  try {
    const gr = await fetch(garmentUrl, { signal: AbortSignal.timeout(10_000) });
    if (!gr.ok) throw new Error(`${gr.status}`);
    garmentMime = (gr.headers.get("content-type") ?? "image/jpeg").split(";")[0].trim();
    garmentB64 = Buffer.from(await gr.arrayBuffer()).toString("base64");
  } catch (e) {
    return NextResponse.json(
      { error: `Could not load product image: ${e instanceof Error ? e.message : "unknown"}` },
      { status: 500 }
    );
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "Try-on service not configured." }, { status: 503 });

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const res = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{
        parts: [
          { text: buildPrompt(garmentName ?? "fashion item") },
          { inlineData: { mimeType: mime as "image/jpeg" | "image/png" | "image/webp", data: personB64 } },
          { inlineData: { mimeType: garmentMime as "image/jpeg" | "image/png" | "image/webp", data: garmentB64 } },
        ],
      }],
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "3:4", imageSize: "1K" },
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      },
    });

    const parts = res.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData) {
        return NextResponse.json(
          { imageData: part.inlineData.data, mimeType: part.inlineData.mimeType ?? "image/jpeg" },
          { headers: { "Cache-Control": "no-store", "X-TryOn-Remaining": String(remaining) } }
        );
      }
    }
    return NextResponse.json({ error: "No image returned. Please try again." }, { status: 500 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429"))
      return NextResponse.json({ error: "Service busy. Try again in a few minutes." }, { status: 503 });
    console.error("[/api/try-on]", msg);
    return NextResponse.json({ error: "Try-on failed. Please try again." }, { status: 500 });
  }
}
