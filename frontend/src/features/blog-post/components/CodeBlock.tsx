import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/** Simple regex-based syntax highlighter for demo purposes */
function highlightSyntax(code: string): string {
  // Escape HTML first
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments  (// ... )
  html = html.replace(
    /(\/\/.*)/g,
    '<span style="color: var(--syn-comment); font-style: italic;">$1</span>'
  );

  // Strings (double & single quoted)
  html = html.replace(
    /(&quot;|"|'|`)([^"'`]*?)(\1)/g,
    '<span style="color: var(--syn-string);">$1$2$3</span>'
  );

  // Keywords
  const keywords =
    "const|let|var|function|return|if|else|for|while|import|export|from|default|class|new|this|async|await|try|catch|throw|typeof|interface|type|extends|implements";
  const kwRegex = new RegExp(`\\b(${keywords})\\b`, "g");
  html = html.replace(
    kwRegex,
    '<span style="color: var(--syn-keyword); font-weight: bold;">$1</span>'
  );

  return html;
}

export const CodeBlock = ({ code, language = "typescript" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-lg my-6 relative group font-mono text-sm overflow-hidden"
      style={{ backgroundColor: "var(--bg-code)" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 text-xs border-b"
        style={{
          color: "var(--text-dim)",
          borderColor: "var(--border)",
        }}
      >
        <span className="uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="hover:opacity-70 transition-opacity px-2 py-0.5 rounded"
          style={{ color: "var(--text-dim)" }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-5 overflow-x-auto leading-relaxed">
        <code
          dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
          style={{ color: "var(--syn-ident)" }}
        />
      </pre>
    </div>
  );
};
