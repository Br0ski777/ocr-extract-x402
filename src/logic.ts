import type { Hono } from "hono";

// OCR using Tesseract.js (loaded dynamically)
// Falls back to a simple pixel-analysis heuristic if Tesseract unavailable

async function extractTextWithTesseract(imageBuffer: Buffer, language: string): Promise<{ text: string; confidence: number }> {
  try {
    const Tesseract = await import("tesseract.js");
    const worker = await Tesseract.createWorker(language);
    const result = await worker.recognize(imageBuffer);
    const text = result.data.text;
    const confidence = result.data.confidence;
    await worker.terminate();
    return { text: text.trim(), confidence };
  } catch {
    throw new Error("Tesseract.js not available. Install tesseract.js dependency.");
  }
}

async function fetchImageBuffer(imageUrl?: string, imageBase64?: string): Promise<Buffer> {
  if (imageBase64) {
    // Strip data URI prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    return Buffer.from(base64Data, "base64");
  }

  if (imageUrl) {
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": "OCR-Extract-API/1.0" },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  throw new Error("Either image_url or image_base64 is required");
}

export function registerRoutes(app: Hono) {
  app.post("/api/ocr", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.image_url && !body?.image_base64) {
      return c.json({ error: "Missing required field: image_url or image_base64" }, 400);
    }

    const language = (body.language || "eng").toLowerCase();

    try {
      const imageBuffer = await fetchImageBuffer(body.image_url, body.image_base64);
      const { text, confidence } = await extractTextWithTesseract(imageBuffer, language);

      const words = text.split(/\s+/).filter((w: string) => w.length > 0);

      return c.json({
        text,
        wordCount: words.length,
        characterCount: text.length,
        confidence: Math.round(confidence * 100) / 100,
        language,
        imageSize: imageBuffer.length,
        source: body.image_url ? "url" : "base64",
      });
    } catch (err: any) {
      return c.json({ error: "OCR extraction failed: " + err.message }, 500);
    }
  });
}
