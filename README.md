# OCR Text Extraction API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://ocr-extract.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Extract text from images using OCR. Supports URLs and base64 images. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "ocr-extract": {
      "url": "https://ocr-extract.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://ocr-extract.api.klymax402.com/api/ocr" \
  -H "Content-Type: application/json" \
  -d '{}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `media_extract_text_from_image` | POST | `/api/ocr` | $0.012 | Extract text from an image via OCR |

### `media_extract_text_from_image`

Use this when you need to extract text from an image. Accepts an image URL or base64-encoded image data. Returns the extracted text, word count, confidence score, and detected language. Do NOT use for web page text extraction — use web_scrape_to_markdown instead. Do NOT use for PDF text extraction — use document_generate_pdf instead. Do NOT use for taking screenshots — use capture_screenshot instead.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `image_url` | string | no | URL of the image to extract text from |
| `image_base64` | string | no | Base64-encoded image data (alternative to image_url) |
| `language` | string | no | Language hint for OCR: eng, fra, deu, spa, etc. (default: eng) |

## Example agent prompts

- "Extract text from an image"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
