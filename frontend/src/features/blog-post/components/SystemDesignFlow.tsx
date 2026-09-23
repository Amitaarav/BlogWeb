import { useState, useEffect } from "react";

export interface SystemDesignStep {
  node: string;
  role: string;
  detail: string;
  metric?: string;
}

interface SystemDesignFlowProps {
  title?: string;
  steps: SystemDesignStep[];
}

export const SystemDesignFlow = ({
  title = "Interactive System Architecture Flow",
  steps,
}: SystemDesignFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isPlaying) {
        timer = setInterval(() => {
          setCurrentStep((prev) => (prev + 1) % steps.length);
        }, 3000);
      }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, steps.length]);

  if (!steps || steps.length === 0) return null;

  const active = steps[currentStep] || steps[0];

  return (
    <div
      className="my-6 rounded-lg border font-mono overflow-hidden transition-colors"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-4 py-2 text-xs border-b"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-dim)",
        }}
      >
        <span className="font-bold flex items-center gap-1.5" style={{ color: "var(--text)" }}>
          <span style={{ color: "var(--accent)" }}>🔀</span> {title}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2 py-0.5 rounded border transition hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: isPlaying ? "var(--accent)" : "var(--text-dim)",
            }}
          >
            {isPlaying ? "❚❚ Pause" : "▶ Auto Play"}
          </button>
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="p-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] gap-2 py-4">
          {steps.map((s, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <div key={idx} className="flex items-center flex-1">
                {/* Node Pill */}
                <button
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer ${
                    isActive ? "scale-105 shadow-md" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? "var(--bg-secondary)"
                      : "var(--bg-card)",
                    borderColor: isActive
                      ? "var(--accent)"
                      : isCompleted
                      ? "var(--syn-string)"
                      : "var(--border)",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mb-1 transition-colors"
                    style={{
                      backgroundColor: isActive
                        ? "var(--accent)"
                        : isCompleted
                        ? "var(--syn-string)"
                        : "var(--border)",
                      color: "#fff",
                    }}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </span>
                  <span
                    className="font-bold text-xs truncate max-w-[110px]"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {s.node}
                  </span>
                  <span
                    className="text-[10px] truncate max-w-[100px]"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {s.role}
                  </span>
                </button>

                {/* Arrow Connector */}
                {idx < steps.length - 1 && (
                  <div
                    className="mx-2 text-xs font-bold select-none transition-colors"
                    style={{
                      color: idx < currentStep ? "var(--syn-string)" : "var(--border)",
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Stage Detail Card */}
        <div
          className="mt-4 p-4 rounded-lg border transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <h4 className="font-bold text-sm" style={{ color: "var(--text)" }}>
                Stage {currentStep + 1}: {active.node} ({active.role})
              </h4>
            </div>
            {active.metric && (
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                }}
              >
                📊 {active.metric}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            {active.detail}
          </p>
        </div>

        {/* Stepper Controls */}
        <div className="flex justify-between items-center mt-4 pt-2">
          <button
            onClick={() => {
              setCurrentStep((prev) => Math.max(0, prev - 1));
              setIsPlaying(false);
            }}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded border text-xs font-bold transition disabled:opacity-30"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            ‹ Previous Stage
          </button>

          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentStep(i);
                  setIsPlaying(false);
                }}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: i === currentStep ? "var(--accent)" : "var(--border)",
                  width: i === currentStep ? "16px" : "8px",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
              setIsPlaying(false);
            }}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 rounded text-white text-xs font-bold transition disabled:opacity-30"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Next Stage ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemDesignFlow;
