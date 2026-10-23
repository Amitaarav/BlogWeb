import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";
import { copyCodeToClipboard } from "../utils/codeUtils";

function getCodeText(markup: string): string {
  const content = markup.match(/<code[^>]*>([\s\S]*?)<\/code>/)?.[1] ?? "";
  return content
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
}

describe("CodeBlock", () => {
  it("renders source literally without introducing highlighter styles into code text", () => {
    const source = 'const message = `hello <section>& "world"`; // source comment';
    const visibleCode = getCodeText(renderToStaticMarkup(<CodeBlock code={source} />));

    expect(visibleCode).toBe(source);
    expect(visibleCode).not.toContain("var(--syn-string)");
    expect(visibleCode).not.toContain("var(--syn-comment)");
    expect(visibleCode).not.toContain("font-style: italic");
  });

  it("preserves CSS-looking text when it is part of the original source", () => {
    const source = 'const styles = "var(--syn-string) font-style: italic";';

    expect(getCodeText(renderToStaticMarkup(<CodeBlock code={source} />))).toBe(source);
  });

  it("renders SQL quoted strings and operators without altering source", () => {
    const source = `SELECT name FROM users WHERE name = 'O''Reilly' AND score > 10;`;

    expect(
      getCodeText(renderToStaticMarkup(<CodeBlock code={source} language="sql" />)),
    ).toBe(source);
  });

  it("copies the original source without transformations", async () => {
    const source = "SELECT * FROM posts WHERE title = 'A > B';\n";
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await copyCodeToClipboard(source);

    expect(writeText).toHaveBeenCalledExactlyOnceWith(source);
    vi.unstubAllGlobals();
  });
});