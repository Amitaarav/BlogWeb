import { useState } from "react";
import { copyCodeToClipboard } from "../utils/codeUtils";

interface CodeBlockProps {
  code: string;
  language?: string;
}

function highlightSyntax(code: string, language: string) {
  const sql = language === "sql";
  const tokenRegex = sql
    ? /--[^\r\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_$][\w$]*\b/g
    : /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Za-z_$][\w$]*\b/g;
  const keywords = new Set(
    sql
      ? "select from where and or not null insert into values update set delete join left right inner outer on as group by order having limit offset create table primary key foreign references default count distinct like is between union all returning"
          .split(" ")
      : "const let var function return if else for while import export from default class new this async await try catch throw typeof interface type extends implements"
          .split(" "),
  );
  const tokens: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of code.matchAll(tokenRegex)) {
    const value = match[0];
    const index = match.index ?? 0;

    if (index > cursor) tokens.push(code.slice(cursor, index));

    let className = "";
    if (/^(\/\/|\/\*|--)/.test(value)) {
      className = "text-[var(--syn-comment)] italic";
    } else if (/^["'`]/.test(value)) {
      className = "text-[var(--syn-string)]";
    } else if (keywords.has(value.toLowerCase())) {
      className = "font-bold text-[var(--syn-keyword)]";
    }

    tokens.push(
      className ? <span className={className} key={index}>{value}</span> : value,
    );
    cursor = index + value.length;
  }

  if (cursor < code.length) tokens.push(code.slice(cursor));
  return tokens;
}

export const CodeBlock = ({ code, language = "typescript" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyCodeToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="article-code rounded-lg my-6 relative group font-mono text-sm overflow-hidden"
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
        <code style={{ color: "var(--syn-ident)" }}>{highlightSyntax(code, language)}</code>
      </pre>
    </div>
  );
};
