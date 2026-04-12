import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "ocr-extract",
  slug: "ocr-extract",
  description: "Extract text from images using OCR. Supports URLs and base64 images.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/ocr",
      price: "$0.005",
      description: "Extract text from an image via OCR",
      toolName: "media_extract_text_from_image",
      toolDescription: "Use this when you need to extract text from an image. Accepts an image URL or base64-encoded image data. Returns the extracted text, word count, confidence score, and detected language. Do NOT use for web page text extraction — use web_scrape_to_markdown instead. Do NOT use for PDF text extraction — use document_generate_pdf instead. Do NOT use for taking screenshots — use capture_screenshot instead.",
      inputSchema: {
        type: "object",
        properties: {
          image_url: { type: "string", description: "URL of the image to extract text from" },
          image_base64: { type: "string", description: "Base64-encoded image data (alternative to image_url)" },
          language: { type: "string", description: "Language hint for OCR: eng, fra, deu, spa, etc. (default: eng)" },
        },
        required: [],
      },
    },
  ],
};
