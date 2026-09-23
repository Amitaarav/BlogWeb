import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BlogNav } from "../features/blog-post/components/BlogNav";
import { AnnouncementBar } from "../features/blog-post/components/AnnouncementBar";
import { BlogFooter } from "../features/blog-post/components/BlogFooter";
import { Breadcrumb } from "../features/blog-post/components/Breadcrumb";
import { BlogTitle } from "../features/blog-post/components/BlogTitle";
import { CodeBlock } from "../features/blog-post/components/CodeBlock";
import { MermaidDiagram } from "../features/blog-post/components/MermaidDiagram";
import { CodeSandbox } from "../features/blog-post/components/CodeSandbox";
import { SystemDesignFlow } from "../features/blog-post/components/SystemDesignFlow";
import { parseBlogContent } from "../features/blog-post/utils/contentParser";
import { Spinner } from "../components/Spinner";
import { BACKEND_URL } from "../config";

const TEMPLATES = {
  systemFlow: `\`\`\`system-design
Client | Web App | Initiates HTTPS POST request with Bearer JWT | 15ms
API Gateway | Cloudflare Worker | Validates rate limit (Token Bucket) & routes traffic | 2ms
Redis Cache | LRU Cache | Checks hot key for cached payload | 1ms
Worker DB | PostgreSQL | Writes transaction with optimistic concurrency | 8ms
Kafka Queue | Event Bus | Publishes post.created event for search indexing | 3ms
\`\`\`
`,

  mermaidFlowchart: `\`\`\`mermaid
flowchart TD
  Client([Web Browser / Client]) --> Gateway[API Gateway / Worker]
  Gateway --> Auth[Auth Service]
  Gateway --> BlogService[Blog Service]
  BlogService --> Cache[(Redis Cache)]
  BlogService --> Database[(PostgreSQL DB)]
  BlogService -.-> Queue>Kafka Event Queue]
\`\`\`
`,

  mermaidSequence: `\`\`\`mermaid
sequenceDiagram
  autonumber
  actor User as Engineer
  participant GW as API Gateway
  participant Auth as Auth Microservice
  participant DB as Primary PostgreSQL
  User->>GW: POST /api/v1/blogs (with JWT)
  GW->>Auth: Verify JWT Signature
  Auth-->>GW: 200 OK (userId: "dev-42")
  GW->>DB: INSERT into "Blog" table
  DB-->>GW: 201 Created (id: "b-987")
  GW-->>User: { success: true, id: "b-987" }
\`\`\`
`,

  codeSandbox: `\`\`\`sandbox
// Live In-Browser Runnable Sandbox
function calculateThroughput(requestsPerSec, avgLatencyMs) {
  console.log("Analyzing system throughput...");
  const concurrency = (requestsPerSec * avgLatencyMs) / 1000;
  console.log("Requests/sec:", requestsPerSec);
  console.log("Average Latency:", avgLatencyMs + "ms");
  console.log("Required Concurrency (Little's Law):", Math.ceil(concurrency));
  return { rps: requestsPerSec, concurrency: Math.ceil(concurrency) };
}

const metrics = calculateThroughput(2500, 18);
console.log("Status: System within capacity limits ✓");
\`\`\`
`,

  caseStudy: `## Overview
A high-throughput distributed blog engine engineered for software developers to publish system architectures, code sandboxes, and flow diagrams.

## System Architecture
Here is the end-to-end request lifecycle through the edge network:

\`\`\`mermaid
flowchart LR
  Client[Client SPA] --> Edge[Edge Gateway]
  Edge --> Cache[(Redis Layer)]
  Edge --> DB[(Hyperdrive Postgres)]
\`\`\`

## Interactive System Flow
\`\`\`system-design
Edge Worker | Global CDN | Terminate SSL & verify auth token | 5ms
Cache Layer | Redis | Cache-aside lookup for post metadata | 1ms
Storage | Postgres | ACID transaction for writes | 12ms
\`\`\`

## Key Takeaways
- Decoupling rendering from edge storage allows sub-20ms reads globally.
- Interactive code sandboxes eliminate reader context switching.
`
};

export const Publish: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  // Load draft or fetch blog
  useEffect(() => {
    if (isEditing && id) {
      setFetching(true);
      const token = localStorage.getItem("token");
      axios
        .get(`${BACKEND_URL}/api/v1/blogs/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          const blog = res.data.blog;
          if (blog) {
            setTitle(blog.title || "");
            setDescription(blog.content || "");
          }
          setFetching(false);
        })
        .catch((err) => {
          console.error("Error fetching blog for editing:", err);
          setError("Failed to load blog for editing");
          setFetching(false);
        });
    } else {
      // Restore draft if any
      const savedDraft = localStorage.getItem("blogweb_creator_draft");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.content) setDescription(parsed.content);
        } catch {
          //
        }
      }
    }
  }, [isEditing, id]);

  // Auto-save draft for new posts
  useEffect(() => {
    if (!isEditing && (title || description)) {
      localStorage.setItem(
        "blogweb_creator_draft",
        JSON.stringify({ title, content: description })
      );
    }
  }, [title, description, isEditing]);

  const insertSnippet = (snippet: string) => {
    setDescription((prev) => `${prev.trim()}\n\n${snippet}\n`);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!title.trim() || !description.trim()) {
        setError("Both title and article content are required.");
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: token ? `Bearer ${token}` : "" };

        if (isEditing && id) {
          await axios.put(
            `${BACKEND_URL}/api/v1/blogs`,
            { id, title: title.trim(), content: description.trim() },
            { headers }
          );
          navigate(`/blog/${id}`);
        } else {
          const { data } = await axios.post(
            `${BACKEND_URL}/api/v1/blogs`,
            { title: title.trim(), content: description.trim() },
            { headers }
          );
          localStorage.removeItem("blogweb_creator_draft");
          navigate(`/blog/${data.id}`);
        }
      } catch (err: unknown) {
        if(axios.isAxiosError(err)){
          setError(
            err.response?.data?.message ||
            "Failed to update profile"
          )
        } else{
          setError("Failed to update profile")
        } 
      } finally {
          setLoading(false);
      }
    },
    [title, description, isEditing, id, navigate]
  );

  const { blocks } = useMemo(() => {
    return parseBlogContent(description);
  }, [description]);

  if (fetching) {
    return (
      <div
        className="min-h-screen font-mono flex flex-col transition-colors"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <AnnouncementBar />
        <BlogNav />
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-mono flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />

      {/* Creator Studio Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Studio Control Header */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border mb-4"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-6 rounded-sm inline-block"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <div>
              <h1 className="font-bold text-lg sm:text-xl">
                {isEditing ? "Creator Studio — Edit Story" : "Creator Studio — Authoring"}
              </h1>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Markdown + Mermaid Diagrams + Runnable Code Sandboxes + System Design Flows
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex rounded border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              {(["split", "editor", "preview"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 text-xs font-bold transition capitalize ${
                    viewMode === mode ? "text-white" : "hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: viewMode === mode ? "var(--accent)" : "transparent",
                    color: viewMode === mode ? "#fff" : "var(--text-dim)",
                  }}
                >
                  {mode === "split" ? "Split View" : mode}
                </button>
              ))}
            </div>

            <Link
              to={isEditing && id ? `/blog/${id}` : "/blogs"}
              className="px-3 py-1.5 rounded border text-xs font-bold transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-dim)",
              }}
            >
              Cancel
            </Link>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-1.5 rounded text-white text-xs sm:text-sm font-bold transition hover:opacity-90 shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? "Publishing..." : isEditing ? "Save Changes" : "Publish Story →"}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="p-3 mb-4 rounded text-xs border font-semibold"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent)",
              backgroundColor: "var(--bg-card)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Studio Split Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
          {/* Left Column: Editor Pane */}
          {(viewMode === "split" || viewMode === "editor") && (
            <div
              className={`${
                viewMode === "editor" ? "lg:col-span-12" : "lg:col-span-6"
              } flex flex-col rounded-lg border overflow-hidden`}
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              {/* Inserter Toolbar */}
              <div
                className="flex flex-wrap items-center gap-1.5 p-2.5 border-b text-xs overflow-x-auto"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                <span className="font-bold text-[11px] uppercase mr-1" style={{ color: "var(--text-dim)" }}>
                  Insert:
                </span>
                <button
                  type="button"
                  onClick={() => insertSnippet(TEMPLATES.systemFlow)}
                  className="px-2 py-1 rounded border text-[11px] font-bold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text)",
                  }}
                  title="Insert interactive System Design Flow"
                >
                  🔀 System Flow
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet(TEMPLATES.mermaidFlowchart)}
                  className="px-2 py-1 rounded border text-[11px] font-bold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text)",
                  }}
                  title="Insert Mermaid Architecture Flowchart"
                >
                  📐 Architecture
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet(TEMPLATES.mermaidSequence)}
                  className="px-2 py-1 rounded border text-[11px] font-bold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text)",
                  }}
                  title="Insert API Sequence Diagram"
                >
                  ⇄ Sequence
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet(TEMPLATES.codeSandbox)}
                  className="px-2 py-1 rounded border text-[11px] font-bold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--accent)",
                  }}
                  title="Insert Runnable Code Sandbox"
                >
                  ⚡ Code Sandbox
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet(TEMPLATES.caseStudy)}
                  className="px-2 py-1 rounded border text-[11px] font-bold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text)",
                  }}
                  title="Insert Full Case Study Template"
                >
                  📝 Case Study
                </button>
              </div>

              {/* Title Input */}
              <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <input
                  type="text"
                  placeholder="Article Title (e.g. Distributed Consensus in Raft)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg sm:text-xl font-bold bg-transparent focus:outline-none font-mono"
                  style={{ color: "var(--text)" }}
                  required
                />
              </div>

              {/* Markdown Content Area */}
              <div className="flex-1 relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your article in markdown. Use ```mermaid for diagrams, ```sandbox for runnable code, and ```system-design for interactive flows..."
                  rows={26}
                  className="w-full h-full p-4 font-mono text-xs sm:text-sm leading-relaxed bg-transparent focus:outline-none resize-none"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text)",
                  }}
                  spellCheck={false}
                />
              </div>

              <div
                className="px-4 py-2 border-t text-[11px] flex justify-between items-center"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-dim)",
                }}
              >
                <span>💡 Drafts automatically saved locally.</span>
                <span>{description.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {/* Right Column: Real-time Live Preview */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div
              className={`${
                viewMode === "preview" ? "lg:col-span-12" : "lg:col-span-6"
              } flex flex-col rounded-lg border overflow-hidden`}
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              {/* Preview Header Bar */}
              <div
                className="px-4 py-2.5 border-b text-xs font-bold flex items-center justify-between"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-dim)",
                }}
              >
                <span className="flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                  <span>👁️</span> Real-time Engineering Preview
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border" style={{ borderColor: "var(--border)" }}>
                  Live Renderer
                </span>
              </div>

              {/* Rendered Preview Article */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[780px]">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Engineering", href: "/blogs" },
                    { label: title || "Article Preview" },
                  ]}
                />

                <BlogTitle
                  title={title || "Untitled Article"}
                  authors={["You (Creator)"]}
                  date="Live Preview"
                  readTime={`${Math.max(1, Math.ceil(description.trim().split(/\s+/).length / 200))} min read`}
                />

                <div className="space-y-4 text-sm leading-relaxed">
                  {blocks.length === 0 ? (
                    <div className="text-center py-16" style={{ color: "var(--text-dim)" }}>
                      Type markdown or insert engineering components on the left to see the live preview.
                    </div>
                  ) : (
                    blocks.map((block, idx) => {
                      switch (block.type) {
                        case "heading":
                          return block.level === 2 ? (
                            <h2
                              key={idx}
                              className="text-xl font-bold mt-8 mb-3 flex items-center gap-2"
                              style={{ color: "var(--text)" }}
                            >
                              <span
                                className="w-1.5 h-4 rounded-full inline-block"
                                style={{ backgroundColor: "var(--accent)" }}
                              />
                              {block.text}
                            </h2>
                          ) : (
                            <h3
                              key={idx}
                              className="text-base font-bold mt-6 mb-2"
                              style={{ color: "var(--text)" }}
                            >
                              {block.text}
                            </h3>
                          );

                        case "code":
                          return <CodeBlock key={idx} code={block.code} language={block.language} />;

                        case "mermaid":
                          return <MermaidDiagram key={idx} chart={block.chart} />;

                        case "sandbox":
                          return (
                            <CodeSandbox
                              key={idx}
                              initialCode={block.code}
                              language={block.language}
                              title={block.title}
                            />
                          );

                        case "system-design":
                          return (
                            <SystemDesignFlow
                              key={idx}
                              title={block.title}
                              steps={block.steps}
                            />
                          );

                        case "paragraph":
                          return (
                            <p key={idx} className="leading-relaxed" style={{ color: "var(--text)" }}>
                              {block.text}
                            </p>
                          );

                        case "html":
                          return (
                            <div
                              key={idx}
                              className="leading-relaxed prose-content"
                              style={{ color: "var(--text)" }}
                              dangerouslySetInnerHTML={{ __html: block.html }}
                            />
                          );

                        default:
                          return null;
                      }
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};

export default Publish;
