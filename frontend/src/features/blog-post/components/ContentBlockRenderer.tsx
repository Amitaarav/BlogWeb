import type { ContentBlock } from "../utils/contentParser";
import { ArticleList } from "./ArticleList";
import { CodeBlock } from "./CodeBlock";
import { CodeSandbox } from "./CodeSandbox";
import { MarkdownContent, SanitizedHtml } from "./MarkdownContent";
import { MermaidDiagram } from "./MermaidDiagram";
import { SystemDesignFlow } from "./SystemDesignFlow";

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2
          id={block.id}
          className="text-2xl font-bold mt-10 mb-4 scroll-mt-28 flex items-center gap-2"
          style={{ color: "var(--text)" }}
        >
          <span
            className="w-1.5 h-5 rounded-full inline-block"
            style={{ backgroundColor: "var(--accent)" }}
          />
          {block.text}
        </h2>
      ) : (
        <h3
          id={block.id}
          className="text-lg font-bold mt-8 mb-3 scroll-mt-28"
          style={{ color: "var(--text)" }}
        >
          {block.text}
        </h3>
      );
    case "code":
      return <CodeBlock code={block.code} language={block.language} />;
    case "mermaid":
      return <MermaidDiagram chart={block.chart} />;
    case "sandbox":
      return (
        <CodeSandbox
          initialCode={block.code}
          language={block.language}
          title={block.title}
        />
      );
    case "system-design":
      return <SystemDesignFlow title={block.title} steps={block.steps} />;
    case "list":
      return <ArticleList items={block.items} ordered={block.ordered} />;
    case "paragraph":
      return (
        <p className="leading-relaxed" style={{ color: "var(--text)" }}>
          <MarkdownContent source={block.text} />
        </p>
      );
    case "html":
      return (
        <SanitizedHtml
          html={block.html}
          className="leading-relaxed prose-content"
        />
      );
    default:
      return null;
  }
}