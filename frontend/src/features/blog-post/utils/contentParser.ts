
import type { TocItem } from "../components/TableOfContents";
import type { SystemDesignStep } from "../components/SystemDesignFlow";
import { marked, type Token } from "marked";

export type ContentBlock =
  | { type: "heading"; id: string; text: string; level: 2 | 3 }
  | { type: "code"; language: string; code: string }
  | { type: "mermaid"; chart: string }
  | { type: "sandbox"; code: string; language: string; title?: string }
  | { type: "system-design"; title?: string; steps: SystemDesignStep[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "paragraph"; text: string }
  | { type: "html"; html: string };

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "section"
  );
}

function parseSystemDesignSteps(raw: string): SystemDesignStep[] {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed as SystemDesignStep[];
    }
  } catch {
    // Fall through to the pipe-delimited format.
  }

  const steps: SystemDesignStep[] = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const parts = line.split("|").map((part) => part.trim());

      if (parts.length < 2 || !parts[0] || !parts[1]) {
        return [];
      }

      return [
        {
          node: parts[0],
          role: parts[1],
          detail: parts[2] || `Handles operations for ${parts[0]}`,
          metric: parts[3] || undefined,
        },
      ];
    });

  return steps.length > 0
    ? steps
    : [
        {
          node: "Client",
          role: "Frontend Browser",
          detail: "Initiates HTTPS API request with auth headers.",
          metric: "10ms",
        },
        {
          node: "API Gateway",
          role: "Reverse Proxy",
          detail:
            "Performs rate limiting, JWT verification, and SSL termination.",
          metric: "2ms",
        },
        {
          node: "Service",
          role: "Microservice Worker",
          detail: "Executes business logic and queries cache layer.",
          metric: "15ms",
        },
        {
          node: "Database",
          role: "PostgreSQL Replica",
          detail: "Reads transactionally consistent records with indexed lookup.",
          metric: "5ms",
        },
      ];
}

/**
 * Parses text outside fenced code blocks into headings, paragraphs, and lists.
 */
function parseTextBlocks(
  text: string,
  blocks: ContentBlock[],
  tocItems: TocItem[],
  getUniqueSlug: (base: string) => string,
): void {
  const normalized = text
    .replace(/\r\n?/g, "\n")
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2\s*>/gi, "\n\n## $1\n\n")
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3\s*>/gi, "\n\n### $1\n\n")
    .replace(/<hr\b[^>]*\/?>/gi, "\n\n---\n\n")
    .replace(/<br\s*\/?>/gi, "  \n")
    .replace(/<\/?p\b[^>]*>/gi, "\n\n");
  const tokens = marked.lexer(normalized, { gfm: true });

  const plainText = (token: Token): string =>
    ("text" in token ? token.text : token.raw)
      .replace(/<[^>]*>/g, "")
      .replace(/[`*_~]/g, "")
      .trim();

  for (const token of tokens) {
    if (token.type === "heading") {
      const headingText = plainText(token);
      if (!headingText) continue;

      const id = getUniqueSlug(headingText);
      const level: 2 | 3 = token.depth >= 3 ? 3 : 2;
      blocks.push({ type: "heading", id, text: headingText, level });
      tocItems.push({ id, label: headingText, level });
      continue;
    }

    if (token.type === "paragraph" || token.type === "text") {
      if (token.text.trim()) {
        blocks.push({ type: "paragraph", text: token.text.trim() });
      }
      continue;
    }

    if (token.type === "list") {
      const previous = blocks[blocks.length - 1];
      if (previous?.type === "list" && previous.ordered === token.ordered) {
        previous.items.push(
          ...token.items.map((item: { text: string }) => item.text),
        );
      } else {
        blocks.push({
          type: "list",
          ordered: token.ordered,
          items: token.items.map((item: { text: string }) => item.text),
        });
      }
      continue;
    }

    if (token.type === "code") {
      blocks.push({
        type: "code",
        language: token.lang?.split(/[\s,]/, 1)[0]?.toLowerCase() || "text",
        code: token.text,
      });
      continue;
    }

    if (token.type === "html") {
      blocks.push({ type: "html", html: token.text });
      continue;
    }

    if (token.type !== "space" && token.type !== "hr") {
      blocks.push({ type: "html", html: marked.parse(token.raw, { async: false }) as string });
    }
  }
}

/**
 * Parses article content into renderable blocks and builds a table of contents.
 *
 * Fenced source text retains its contents with CRLF/CR normalized to LF.
 * Supported fences:
 * ```mermaid
 * ```sandbox
 * ```runnable
 * ```system-design
 * ```flow
 * ```typescript (or another language)
 */
export function parseBlogContent(rawContent: string): {
  blocks: ContentBlock[];
  tocItems: TocItem[];
} {
  if (!rawContent?.trim()) {
    return {
      blocks: [{ type: "paragraph", text: "No content available." }],
      tocItems: [],
    };
  }

  const blocks: ContentBlock[] = [];
  const tocItems: TocItem[] = [];
  const usedSlugs = new Set<string>();

  const getUniqueSlug = (base: string): string => {
    const root = slugify(base);
    let slug = root;
    let counter = 1;

    while (usedSlugs.has(slug)) {
      slug = `${root}-${counter++}`;
    }

    usedSlugs.add(slug);
    return slug;
  };

  // Match fenced code blocks before parsing ordinary text. This prevents
  // Markdown-looking syntax inside code from being interpreted as article text.
  const fenceRegex =
    /^[ \t]{0,3}(`{3,}|~{3,})[ \t]*([a-zA-Z0-9_-]+)?[^\r\n]*\r?\n([\s\S]*?)^[ \t]{0,3}\1[ \t]*$/gm;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(rawContent)) !== null) {
    const before = rawContent.slice(lastIndex, match.index);

    if (before.trim()) {
      parseTextBlocks(before, blocks, tocItems, getUniqueSlug);
    }

    const language = (match[2] || "text").toLowerCase();
    const code = match[3].replace(/\r\n?/g, "\n");

    switch (language) {
      case "mermaid":
        blocks.push({ type: "mermaid", chart: code });
        break;

      case "sandbox":
      case "runnable":
        blocks.push({
          type: "sandbox",
          code,
          language: "javascript",
          title: "Live Code Sandbox",
        });
        break;

      case "system-design":
      case "flow":
        blocks.push({
          type: "system-design",
          title: "Interactive System Flow",
          steps: parseSystemDesignSteps(code),
        });
        break;

      default:
        blocks.push({ type: "code", language, code });
        break;
    }

    lastIndex = fenceRegex.lastIndex;
  }

  const remaining = rawContent.slice(lastIndex);

  if (remaining.trim()) {
    parseTextBlocks(remaining, blocks, tocItems, getUniqueSlug);
  }

  // Add a fallback heading only when the article has no real headings.
  if (tocItems.length === 0 && blocks.length > 0) {
    blocks.unshift({
      type: "heading",
      id: "overview",
      text: "Overview",
      level: 2,
    });

    tocItems.push({
      id: "overview",
      label: "Overview",
      level: 2,
    });
  }

  return { blocks, tocItems };
}
