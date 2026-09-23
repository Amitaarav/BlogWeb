import type { TocItem } from "../components/TableOfContents";
import type { SystemDesignStep } from "../components/SystemDesignFlow";

export type ContentBlock =
  | { type: "heading"; id: string; text: string; level: 2 | 3 }
  | { type: "code"; language: string; code: string }
  | { type: "mermaid"; chart: string }
  | { type: "sandbox"; code: string; language: string; title?: string }
  | { type: "system-design"; title?: string; steps: SystemDesignStep[] }
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

/**
 * Helper to parse system-design block (supports JSON or pipe-delimited text)
 */
function parseSystemDesignSteps(raw: string): SystemDesignStep[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // JSON parsing failed; fall back to pipe-delimited format below.
  }

  // Fallback: parse lines formatted as: Node | Role | Detail | Metric
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const steps: SystemDesignStep[] = [];

  for (const line of lines) {
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length >= 2) {
      steps.push({
        node: parts[0],
        role: parts[1],
        detail: parts[2] || `Handles operations for ${parts[0]}`,
        metric: parts[3] || undefined,
      });
    }
  }

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
          detail: "Performs rate limiting, JWT verification, and SSL termination.",
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
 * Parses raw blog content (markdown, code blocks, mermaid diagrams, sandboxes, flows)
 * into structured renderable blocks and extracts Table of Contents items.
 */
export function parseBlogContent(rawContent: string): {
  blocks: ContentBlock[];
  tocItems: TocItem[];
} {
  if (!rawContent || !rawContent.trim()) {
    return {
      blocks: [{ type: "paragraph", text: "No content available." }],
      tocItems: [],
    };
  }

  const blocks: ContentBlock[] = [];
  const tocItems: TocItem[] = [];
  const usedSlugs = new Set<string>();

  const getUniqueSlug = (base: string) => {
    let slug = slugify(base);
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(base)}-${counter++}`;
    }
    usedSlugs.add(slug);
    return slug;
  };

  // Match markdown code fences: ```language ... ```
  const codeFenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeFenceRegex.exec(rawContent)) !== null) {
    const textBefore = rawContent.slice(lastIndex, match.index);
    if (textBefore.trim()) {
      parseTextBlocks(textBefore, blocks, tocItems, getUniqueSlug);
    }

    const language = (match[1]?.trim() || "typescript").toLowerCase();
    const code = match[2]?.replace(/\r\n/g, "\n").trim();

    if (language === "mermaid") {
      blocks.push({
        type: "mermaid",
        chart: code,
      });
    } else if (language === "sandbox" || language === "runnable") {
      blocks.push({
        type: "sandbox",
        code,
        language: "javascript",
        title: "Live Code Sandbox",
      });
    } else if (language === "system-design" || language === "flow") {
      const steps = parseSystemDesignSteps(code);
      blocks.push({
        type: "system-design",
        title: "Interactive System Flow",
        steps,
      });
    } else {
      blocks.push({
        type: "code",
        language,
        code,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  const remainingText = rawContent.slice(lastIndex);
  if (remainingText.trim()) {
    parseTextBlocks(remainingText, blocks, tocItems, getUniqueSlug);
  }

  // If no headings exist, generate logical fallback sections
  if (tocItems.length === 0 && blocks.length > 0) {
    const firstHeadingId = "overview";
    blocks.unshift({
      type: "heading",
      id: firstHeadingId,
      text: "Overview",
      level: 2,
    });
    tocItems.push({
      id: firstHeadingId,
      label: "Overview",
      level: 2,
    });

    if (blocks.length > 4) {
      const midPoint = Math.floor(blocks.length / 2);
      const midId = "architecture";
      blocks.splice(midPoint, 0, {
        type: "heading",
        id: midId,
        text: "Architecture & Implementation",
        level: 2,
      });
      tocItems.push({
        id: midId,
        label: "Architecture & Implementation",
        level: 2,
      });
    }
  }

  return { blocks, tocItems };
}

function parseTextBlocks(
  text: string,
  blocks: ContentBlock[],
  tocItems: TocItem[],
  getSlug: (base: string) => string
) {
  // Check if text has HTML tags
  if (/<[a-z][\s\S]*>/i.test(text)) {
    const lines = text.split(/(<h[23][^>]*>.*?<\/h[23]>)/i);
    for (const part of lines) {
      const hMatch = /<h([23])[^>]*>(.*?)<\/h\1>/i.exec(part);
      if (hMatch) {
        const level = parseInt(hMatch[1], 10) as 2 | 3;
        const headingText = hMatch[2].replace(/<[^>]*>/g, "").trim();
        const id = getSlug(headingText);
        blocks.push({ type: "heading", id, text: headingText, level });
        tocItems.push({ id, label: headingText, level });
      } else {
        const clean = part.trim();
        if (clean) {
          blocks.push({ type: "html", html: clean });
        }
      }
    }
    return;
  }

  // Markdown line-by-line parsing
  const lines = text.split(/\r?\n/);
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const paraText = currentParagraphLines.join(" ").trim();
      if (paraText) {
        blocks.push({ type: "paragraph", text: paraText });
      }
      currentParagraphLines = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    const h3Match = /^###\s+(.+)$/.exec(trimmed);
    const h2Match = /^##?\s+(.+)$/.exec(trimmed);

    if (h3Match) {
      flushParagraph();
      const headingText = h3Match[1].trim();
      const id = getSlug(headingText);
      blocks.push({ type: "heading", id, text: headingText, level: 3 });
      tocItems.push({ id, label: headingText, level: 3 });
    } else if (h2Match) {
      flushParagraph();
      const headingText = h2Match[1].trim();
      const id = getSlug(headingText);
      blocks.push({ type: "heading", id, text: headingText, level: 2 });
      tocItems.push({ id, label: headingText, level: 2 });
    } else if (trimmed === "") {
      flushParagraph();
    } else {
      currentParagraphLines.push(trimmed);
    }
  }

  flushParagraph();
}
