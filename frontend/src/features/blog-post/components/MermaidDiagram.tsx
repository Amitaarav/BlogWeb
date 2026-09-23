import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (!chart.trim()) return;

      setError(null);
      setSvgContent("");

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          securityLevel: "loose",
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

        const id = `mermaid-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        const { svg } = await mermaid.render(id, chart);

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
  }, [chart, theme]);

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
    <>
      <div
        className="my-6 rounded-lg border font-mono overflow-hidden transition-colors"
        style={{
          backgroundColor: "var(--bg-card)",
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
              onClick={() => setIsFullscreen(true)}
              className="px-2 py-0.5 rounded border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-dim)",
              }}
              title="Expand Fullscreen"
            >
              ⤢ Expand
            </button>
          </div>
        </div>

        {/* Render Canvas */}
        <div className="p-6 overflow-x-auto flex justify-center items-center min-h-[160px]">
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
              ref={containerRef}
              className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
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

      {/* Fullscreen Expansion Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col p-6 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span style={{ color: "var(--accent)" }}>📐</span>
              Fullscreen Architecture Diagram
            </span>

            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/40 rounded-lg border border-white/10">
            <div
              className="max-w-5xl w-full [&>svg]:w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{
                __html: svgContent,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MermaidDiagram;