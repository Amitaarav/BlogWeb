import { marked } from "marked";
import type { ContentBlock } from "./contentParser";

function htmlToText(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
  return document.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function splitLongText(text: string, maxLength = 220): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxLength) {
    let splitAt = remaining.lastIndexOf(" ", maxLength);
    if (splitAt < maxLength / 2) splitAt = maxLength;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

function toReadableText(markdownOrHtml: string): string {
  const parsed = marked.parseInline(markdownOrHtml, { async: false }) as string;
  return htmlToText(parsed);
}

export function createSpeechSegments(blocks: ContentBlock[]): string[] {
  const prose: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        prose.push(block.text);
        break;
      case "paragraph":
        prose.push(toReadableText(block.text));
        break;
      case "list":
        prose.push(...block.items.map(toReadableText));
        break;
      case "html":
        prose.push(toReadableText(block.html));
        break;
      default:
        break;
    }
  }

  return prose.flatMap((text) => splitLongText(text)).filter(Boolean);
}