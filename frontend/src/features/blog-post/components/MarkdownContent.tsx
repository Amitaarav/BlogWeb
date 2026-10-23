import DOMPurify, { type Config } from "dompurify";
import { marked } from "marked";

const SANITIZER_OPTIONS: Config = {
  ALLOWED_TAGS: [
    "a", "abbr", "b", "blockquote", "br", "code", "del", "div", "em",
    "h1", "h2", "h3", "h4", "hr", "i", "img", "li", "ol", "p", "pre",
    "s", "span", "strong", "sub", "sup", "table", "tbody", "td", "th",
    "thead", "tr", "ul",
  ],
  ALLOWED_ATTR: ["alt", "class", "href", "id", "rel", "src", "target", "title"],
  ALLOW_DATA_ATTR: false,
};

export function SanitizedHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const cleanHtml = DOMPurify.sanitize(html, SANITIZER_OPTIONS);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

export function MarkdownContent({ source }: { source: string }) {
  const html = marked.parseInline(source, { async: false }) as string;
  const cleanHtml = DOMPurify.sanitize(html, SANITIZER_OPTIONS);

  return <span dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}