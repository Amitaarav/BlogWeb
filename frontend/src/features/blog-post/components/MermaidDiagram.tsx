import { useState, useEffect, useId } from "react";
import { useTheme } from "../../../context/useTheme";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const reactId = useId();
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const renderId = `${diagramId}-svg`;
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (!chart.trim()) {
        setError("Diagram source is empty");
        return;
      }

      setError(null);
      setSvgContent("");

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "'JetBrains Mono', monospace",

          themeVariables:
            theme === "dark"
              ? {
                  primaryColor: "#1e1e1e",
                  primaryTextColor: "#f2f2f2",
                  primaryBorderColor: "#e8501c",
                  lineColor: "#888888",
                  secondaryColor: "#141414",
                  tertiaryColor: "#171717",
                }
              : {
                  primaryColor: "#f5f5f5",
                  primaryTextColor: "#171717",
                  primaryBorderColor: "#e8501c",
                  lineColor: "#666666",
                },
        });

        const { svg } = await mermaid.render(renderId, chart);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: unknown) {
        console.warn("Mermaid rendering failed:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to render diagram syntax"
          );
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, renderId, theme]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy Mermaid code:", error);
    }
  };

  return (
      <div
        id={diagramId}
        role={isFullscreen ? "dialog" : undefined}
        aria-modal={isFullscreen ? true : undefined}
        aria-label={isFullscreen ? "Fullscreen architecture diagram" : undefined}
        className={`article-diagram rounded-lg border font-mono overflow-hidden transition-colors ${
          isFullscreen ? "fixed inset-0 z-50 flex flex-col p-6" : "my-6"
        }`}
        style={{
          backgroundColor: isFullscreen ? "rgba(0, 0, 0, 0.9)" : "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Top Control Bar */}
        <div
          className="flex items-center justify-between px-4 py-2 text-xs border-b"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-dim)",
          }}
        >
          <span
            className="font-bold flex items-center gap-1.5"
            style={{ color: "var(--text)" }}
          >
            <span style={{ color: "var(--accent)" }}>📐</span>
            System Flow / Diagram
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-2 py-0.5 rounded border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-dim)",
              }}
            >
              {copied ? "✓ Copied" : "Copy Code"}
            </button>

            <button
              onClick={() => setIsFullscreen((expanded) => !expanded)}
              className="px-2 py-0.5 rounded border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-dim)",
              }}
              title={isFullscreen ? "Close fullscreen" : "Expand fullscreen"}
            >
              {isFullscreen ? "✕ Close" : "⤢ Expand"}
            </button>
          </div>
        </div>

        {/* Render Canvas */}
        <div className={`article-diagram__canvas p-6 overflow-auto flex items-center ${isFullscreen ? "flex-1 justify-center" : "min-h-[160px]"}`}>
          {error ? (
            <div className="text-center p-4">
              <p
                className="text-xs mb-2"
                style={{ color: "var(--accent)" }}
              >
                ⚠️ Diagram Syntax Preview:
              </p>

              <pre
                className="text-xs p-3 rounded text-left overflow-x-auto"
                style={{
                  backgroundColor: "var(--bg-code)",
                  color: "var(--text)",
                }}
              >
                {chart}
              </pre>
            </div>
          ) : svgContent ? (
            <div
              className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
              role="img"
              aria-label={`Mermaid diagram: ${chart.replace(/\s+/g, " ").trim().slice(0, 180)}`}
              dangerouslySetInnerHTML={{
                __html: svgContent,
              }}
            />
          ) : (
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--text-dim)" }}
            >
              <span className="animate-spin">⚙️</span>
              Generating diagram...
            </div>
          )}
        </div>
      </div>
  );
};

export default MermaidDiagram;