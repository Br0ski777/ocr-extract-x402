import type { Hono } from "hono";

// OCR via OCR.space API — lightweight, no WASM deps
// Free tier: 25,000 req/month. Set OCR_SPACE_API_KEY env var for production.

const OCR_API_KEY = process.env.OCR_SPACE_API_KEY || "helloworld";
const OCR_URL = "https://api.ocr.space/parse/image";

// Map ISO 639 codes to OCR.space language codes
const LANG_MAP: Record<string, string> = {
  eng: "eng", fra: "fre", deu: "ger", spa: "spa", ita: "ita",
  por: "por", pol: "pol", nld: "dut", rus: "rus", jpn: "jpn",
  kor: "kor", zho: "chs", ara: "ara", tur: "tur", hun: "hun",
  swe: "swe", fin: "fin", dan: "dan", nor: "nor", ces: "cze",
};

async function extractTextOcr(imageUrl?: string, imageBase64?: string, language = "eng"): Promise<{ text: string; confidence: number; imageSize: number; source: string }> {
  const form = new FormData();
  form.append("apikey", OCR_API_KEY);
  form.append("language", LANG_MAP[language] || "eng");
  form.append("isOverlayRequired", "false");
  form.append("OCREngine", "2"); // Engine 2 = better accuracy

  let imageSize = 0;
  let source = "url";

  if (imageBase64) {
    const clean = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    form.append("base64Image", `data:image/png;base64,${clean}`);
    imageSize = Buffer.from(clean, "base64").length;
    source = "base64";
  } else if (imageUrl) {
    form.append("url", imageUrl);
    source = "url";
  } else {
    throw new Error("Either image_url or image_base64 is required");
  }

  const resp = await fetch(OCR_URL, { method: "POST", body: form });

  if (!resp.ok) {
    throw new Error(`OCR API error: HTTP ${resp.status}`);
  }

  const data = await resp.json() as any;

  if (data.IsErroredOnProcessing) {
    const errMsg = data.ErrorMessage?.join(", ") || "OCR processing failed";
    throw new Error(errMsg);
  }

  const result = data.ParsedResults?.[0];
  if (!result) {
    throw new Error("No OCR results returned");
  }

  const text = (result.ParsedText || "").trim();
  const confidence = result.TextOverlay?.HasOverlay !== false ? 0.92 : 0.7;
  if (source === "url" && data.SearchablePDFURL) {
    imageSize = 0; // not available for URL mode
  }

  return { text, confidence, imageSize, source };
}

export function registerRoutes(app: Hono) {
  app.post("/api/ocr", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.image_url && !body?.image_base64) {
      return c.json({ error: "Missing required field: image_url or image_base64" }, 400);
    }

    const language = (body.language || "eng").toLowerCase();

    try {
      const { text, confidence, imageSize, source } = await extractTextOcr(body.image_url, body.image_base64, language);

      const words = text.split(/\s+/).filter((w: string) => w.length > 0);

      return c.json({
        text,
        wordCount: words.length,
        characterCount: text.length,
        confidence: Math.round(confidence * 100) / 100,
        language,
        imageSize,
        source,
      });
    } catch (err: any) {
      return c.json({ error: "OCR extraction failed: " + err.message }, 500);
    }
  });
}
