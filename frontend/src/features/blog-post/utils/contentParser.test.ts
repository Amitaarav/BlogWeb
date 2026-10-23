import { describe, expect, it } from "vitest";
import { parseBlogContent } from "./contentParser";

describe("parseBlogContent", () => {
  it("parses headings, paragraphs, and inline Markdown", () => {
    const { blocks, tocItems } = parseBlogContent(
      "# Main title\n\nA **bold** and *italic* sentence with `inline code`.\n\n### Details",
    );

    expect(blocks).toContainEqual({
      type: "heading",
      id: "main-title",
      text: "Main title",
      level: 2,
    });
    expect(blocks).toContainEqual({
      type: "paragraph",
      text: "A **bold** and *italic* sentence with `inline code`.",
    });
    expect(tocItems.map((item) => item.label)).toEqual(["Main title", "Details"]);
  });

  it("parses unordered and ordered Markdown lists as separate blocks", () => {
    const { blocks } = parseBlogContent(
      "## Steps\n- **First item**\n* Second item\n\n1. First step\n2. Second step",
    );

    expect(blocks).toContainEqual({
      type: "list",
      ordered: false,
      items: ["**First item**", "Second item"],
    });
    expect(blocks).toContainEqual({
      type: "list",
      ordered: true,
      items: ["First step", "Second step"],
    });
  });

  it("parses indented Mermaid fences with CRLF line endings", () => {
    const { blocks } = parseBlogContent(
      "## Diagram\r\n\r\n  ```mermaid\r\nflowchart TD\r\n  A --> B\r\n  ```"
    );

    expect(blocks).toContainEqual({
      type: "mermaid",
      chart: "flowchart TD\n  A --> B\n",
    });
  });

  it("keeps JavaScript and SQL fenced content as exact source text", () => {
    const javascript = [
      'const template = `hello ${name} <div title="x">`;',
      "// Preserve this comment and var(--syn-comment)",
      "const comparison = left < right && right > 0;",
    ].join("\n");
    const sql = `SELECT name FROM users WHERE name = 'O''Reilly' AND note = "a > b";`;
    const { blocks } = parseBlogContent(
      `\`\`\`javascript\n${javascript}\n\`\`\`\n\n\`\`\`sql\n${sql}\n\`\`\``,
    );

    expect(blocks).toContainEqual({ type: "code", language: "javascript", code: `${javascript}\n` });
    expect(blocks).toContainEqual({ type: "code", language: "sql", code: `${sql}\n` });
  });

  it("keeps mixed supported HTML and Markdown rather than short-circuiting", () => {
    const { blocks } = parseBlogContent(
      '<p>HTML <strong>bold</strong> and **Markdown**.</p>\n\n<h2>Next section</h2>',
    );

    expect(blocks).toContainEqual({
      type: "paragraph",
      text: 'HTML <strong>bold</strong> and **Markdown**.',
    });
    expect(blocks.some((block) => block.type === "heading" && block.text === "Next section")).toBe(true);
  });

  it("recognizes multiple Mermaid fences and preserves malformed fences as code", () => {
    const { blocks } = parseBlogContent(
      "```mermaid\nflowchart TD\n  A --> B\n```\n\n```mermaid\nsequenceDiagram\n  A->>B: go\n```\n\n```javascript\nconst unfinished = true;",
    );

    expect(blocks.filter((block) => block.type === "mermaid")).toHaveLength(2);
    expect(blocks).toContainEqual({
      type: "code",
      language: "javascript",
      code: "const unfinished = true;",
    });
  });

  it("returns the empty-content fallback", () => {
    expect(parseBlogContent(" \n\t")).toEqual({
      blocks: [{ type: "paragraph", text: "No content available." }],
      tocItems: [],
    });
  });
});