import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "ocr-extract",
  slug: "ocr-extract",
  description: "Extract text from images via OCR -- URL or base64 input, confidence score, language detection. Multi-language.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/ocr",
      price: "$0.005",
      description: "Extract text from an image via OCR",
      toolName: "media_extract_text_from_image",
      toolDescription: `Use this when you need to extract text from an image. Accepts an image URL or base64-encoded image. Returns OCR results in JSON.

Returns: 1. text (extracted content) 2. wordCount 3. confidence score (0-1) 4. detectedLanguage 5. processingTime in ms.

Example output: {"text":"Invoice #1234\\nDate: 2026-04-13\\nTotal: $1,500.00","wordCount":7,"confidence":0.94,"detectedLanguage":"eng","processingTime":320}

Use this FOR digitizing receipts, extracting text from screenshots, reading scanned documents, parsing business cards, and automating data entry from images.

Do NOT use for web page text extraction -- use web_scrape_to_markdown instead. Do NOT use for image resizing -- use media_resize_image instead. Do NOT use for taking screenshots -- use capture_screenshot instead.`,
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
