import { useEffect, useMemo, useRef, useState } from "react";
import { createSpeechSegments } from "../utils/speechText";
import type { ContentBlock } from "../utils/contentParser";

type ReaderStatus = "idle" | "playing" | "paused" | "done" | "unsupported";

export function ArticleAudioControls({ blocks }: { blocks: ContentBlock[] }) {
  const segments = useMemo(() => createSpeechSegments(blocks), [blocks]);
  const [status, setStatus] = useState<ReaderStatus>(() =>
    typeof window !== "undefined" && "speechSynthesis" in window
      ? "idle"
      : "unsupported",
  );
  const [rate, setRate] = useState(1);
  const [activeSegment, setActiveSegment] = useState(0);
  const playIdRef = useRef(0);

  useEffect(() => {
    return () => {
      playIdRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startReading = () => {
    if (status === "unsupported" || segments.length === 0) return;

    const speech = window.speechSynthesis;
    const playId = ++playIdRef.current;
    speech.cancel();
    setActiveSegment(0);
    setStatus("playing");

    segments.forEach((text, index) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.onstart = () => {
        if (playId === playIdRef.current) setActiveSegment(index);
      };
      utterance.onend = () => {
        if (playId === playIdRef.current && index === segments.length - 1) {
          setStatus("done");
        }
      };
      utterance.onerror = () => {
        if (playId === playIdRef.current) setStatus("idle");
      };
      speech.speak(utterance);
    });
  };

  const togglePause = () => {
    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
    }
  };

  const stopReading = () => {
    playIdRef.current += 1;
    window.speechSynthesis?.cancel();
    setActiveSegment(0);
    setStatus("idle");
  };

  const isActive = status === "playing" || status === "paused";
  const statusText =
    status === "unsupported"
      ? "Audio reading is not supported in this browser."
      : status === "playing"
        ? `Reading segment ${activeSegment + 1} of ${segments.length}`
        : status === "paused"
          ? "Reading paused"
          : status === "done"
            ? "Finished reading"
            : segments.length === 0
              ? "No readable article text"
              : "Ready to read";

  return (
    <section
      aria-label="Listen to article"
      className="my-5 flex flex-wrap items-center gap-2 border-y py-3"
      style={{ borderColor: "var(--border)" }}
    >
      {isActive ? (
        <button
          type="button"
          onClick={togglePause}
          className="rounded border px-3 py-1.5 text-sm font-bold transition hover:opacity-80"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          {status === "paused" ? "Resume" : "Pause"}
        </button>
      ) : (
        <button
          type="button"
          onClick={startReading}
          disabled={status === "unsupported" || segments.length === 0}
          className="rounded border px-3 py-1.5 text-sm font-bold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text)",
          }}
        >
          {status === "done" ? "Read again" : "Listen"}
        </button>
      )}

      <button
        type="button"
        onClick={stopReading}
        disabled={!isActive && status !== "done"}
        className="rounded border px-3 py-1.5 text-sm transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
      >
        Stop
      </button>

      <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-dim)" }}>
        Speed
        <select
          aria-label="Reading speed"
          value={rate}
          disabled={isActive}
          onChange={(event) => setRate(Number(event.target.value))}
          className="rounded border px-2 py-1"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text)",
          }}
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </label>

      <span role="status" aria-live="polite" className="text-xs" style={{ color: "var(--text-dim)" }}>
        {statusText}
      </span>
    </section>
  );
}