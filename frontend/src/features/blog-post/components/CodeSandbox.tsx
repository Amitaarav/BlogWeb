import { useState } from "react";

interface CodeSandboxProps {
  initialCode: string;
  language?: string;
  title?: string;
}

interface ConsoleOutput {
  type: "log" | "error" | "warn" | "return";
  text: string;
}

export const CodeSandbox = ({
  initialCode,
  language = "javascript",
  title = "Live Code Sandbox",
}: CodeSandboxProps) => {
  const [code, setCode] = useState(initialCode);
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "output">("code");
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    const logs: ConsoleOutput[] = [];
    const startTime = performance.now();

    // Custom console logger
    const customConsole = {
      log: (...args: any[]) => {
        logs.push({
          type: "log",
          text: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
        });
      },
      error: (...args: any[]) => {
        logs.push({
          type: "error",
          text: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
        });
      },
      warn: (...args: any[]) => {
        logs.push({
          type: "warn",
          text: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "),
        });
      },
    };

    try {
      // Safe execution using Function constructor with captured console
      const runFn = new Function("console", `"use strict";\n${code}`);
      const result = runFn(customConsole);

      if (result !== undefined) {
        logs.push({
          type: "return",
          text: `↩ Return: ${typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)}`,
        });
      }
    } catch (err: any) {
      logs.push({
        type: "error",
        text: `Error: ${err?.message || String(err)}`,
      });
    }

    const duration = performance.now() - startTime;
    setExecutionTime(Math.round(duration * 100) / 100);
    setOutputs(logs.length > 0 ? logs : [{ type: "log", text: "(Executed successfully with no logs)" }]);
    setIsRunning(false);
    setActiveTab("output");
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutputs([]);
    setExecutionTime(null);
    setActiveTab("code");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="my-6 rounded-lg border font-mono text-xs overflow-hidden transition-colors"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Top Header Bar */}
      <div
        className="flex flex-wrap items-center justify-between px-4 py-2 border-b gap-2"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-dim)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold flex items-center gap-1.5" style={{ color: "var(--text)" }}>
            <span style={{ color: "var(--accent)" }}>⚡</span> {title}
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
            style={{
              backgroundColor: "var(--bg-code)",
              color: "var(--accent)",
            }}
          >
            {language} (Runnable)
          </span>
        </div>

        {/* Tab Switcher & Run Controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 font-bold transition ${
                activeTab === "code" ? "text-white" : "hover:opacity-80"
              }`}
              style={{
                backgroundColor: activeTab === "code" ? "var(--accent)" : "transparent",
                color: activeTab === "code" ? "#fff" : "var(--text-dim)",
              }}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={`px-3 py-1 font-bold transition relative ${
                activeTab === "output" ? "text-white" : "hover:opacity-80"
              }`}
              style={{
                backgroundColor: activeTab === "output" ? "var(--accent)" : "transparent",
                color: activeTab === "output" ? "#fff" : "var(--text-dim)",
              }}
            >
              Output {outputs.length > 0 && `(${outputs.length})`}
            </button>
          </div>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-3 py-1 rounded text-white font-bold transition hover:opacity-90 flex items-center gap-1 shadow-sm"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {isRunning ? "Running..." : "▶ Run"}
          </button>

          <button
            onClick={handleReset}
            className="px-2 py-1 rounded border transition hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-dim)",
            }}
            title="Reset code"
          >
            ↺
          </button>

          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded border transition hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-dim)",
            }}
            title="Copy code"
          >
            {copied ? "✓" : "📋"}
          </button>
        </div>
      </div>

      {/* Code Editor Pane */}
      {activeTab === "code" ? (
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={Math.min(18, Math.max(7, code.split("\n").length + 2))}
            className="w-full p-4 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y border-none"
            style={{
              backgroundColor: "var(--bg-code)",
              color: "var(--text)",
            }}
            spellCheck={false}
          />
          <div
            className="px-4 py-1.5 border-t text-[10px] flex justify-between"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-dim)",
            }}
          >
            <span>💡 You can edit and test code directly in your browser.</span>
            <span>{code.split("\n").length} lines</span>
          </div>
        </div>
      ) : (
        /* Console Output Pane */
        <div
          className="p-4 min-h-[140px] max-h-[320px] overflow-y-auto space-y-1"
          style={{ backgroundColor: "var(--bg-code)" }}
        >
          {outputs.length === 0 ? (
            <div className="text-center py-6" style={{ color: "var(--text-dim)" }}>
              Click <strong>"▶ Run"</strong> to execute this code in the sandbox.
            </div>
          ) : (
            outputs.map((out, idx) => (
              <div
                key={idx}
                className="font-mono text-xs py-0.5 whitespace-pre-wrap flex items-start gap-2"
                style={{
                  color:
                    out.type === "error"
                      ? "var(--accent)"
                      : out.type === "warn"
                      ? "var(--announce)"
                      : out.type === "return"
                      ? "var(--syn-string)"
                      : "var(--text)",
                }}
              >
                <span className="opacity-50 select-none">{out.type === "return" ? "◀" : "›"}</span>
                <span>{out.text}</span>
              </div>
            ))
          )}

          {executionTime !== null && (
            <div
              className="mt-3 pt-2 border-t text-[10px] flex justify-between"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-dim)",
              }}
            >
              <span>Execution completed</span>
              <span>⚡ {executionTime} ms</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeSandbox;
