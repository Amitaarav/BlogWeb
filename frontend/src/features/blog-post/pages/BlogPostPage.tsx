import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBlog, useCurrentUser } from "../../../hooks/useBlogs";
import { Spinner } from "../../../components/Spinner";
import { Avatar } from "../../../components/BlogCard";
import { BACKEND_URL } from "../../../config";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { BlogNav } from "../components/BlogNav";
import { Breadcrumb } from "../components/Breadcrumb";
import { BlogTitle } from "../components/BlogTitle";
import { CodeBlock } from "../components/CodeBlock";
import { TableOfContents } from "../components/TableOfContents";
import { BlogFooter } from "../components/BlogFooter";
import { MermaidDiagram } from "../components/MermaidDiagram";
import { CodeSandbox } from "../components/CodeSandbox";
import { SystemDesignFlow } from "../components/SystemDesignFlow";
import { parseBlogContent, ContentBlock } from "../utils/contentParser";

const DEMO_ENGINEERING_BLOG = {
  id: "demo",
  authorId: "demo-author",
  title:
    "Architecting a Resilient Distributed System: Edge Caching, Asynchronous Pipelines & Concurrency",
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: {
    id: "demo-author",
    name: "Staff Engineer",
    username: "sys_architect",
  },
  content: `## Architecture Overview
Modern distributed architectures require decoupling synchronous client requests from heavy downstream dependencies. By implementing edge validation, cache-aside layers, and event-driven worker pools, we achieve sub-10ms global response latencies.

## End-to-End System Architecture
The vector diagram below models our request lifecycle across edge gateways, in-memory caches, and storage replicas:

\`\`\`mermaid
flowchart TD
  Client([Web Browser / Client]) --> Cloudflare[Cloudflare Edge Gateway]
  Cloudflare --> Auth[Auth & Rate Limiting Service]
  Auth --> API[API Microservice]
  API --> Redis[(Redis In-Memory Cache)]
  API --> PrimaryDB[(PostgreSQL Primary)]
  API -.-> Kafka>Kafka Event Stream]
  Kafka --> Worker[Async Search Indexer Worker]
  Worker --> Elastic[(Elasticsearch)]
\`\`\`

## Interactive System Design Flow
Walk through the execution pipeline step-by-step to inspect protocol, latencies, and service responsibilities:

\`\`\`system-design
Client | React SPA | Initiates HTTPS request with Bearer JWT | 12ms
Edge Gateway | Cloudflare Worker | Terminates TLS & enforces Token Bucket rate limit | 2ms
Redis Cache | LRU Cluster | Queries cached payload (95% cache hit ratio) | 1ms
Primary DB | PostgreSQL | Writes transaction with row-level locks & WAL | 8ms
Kafka Queue | Distributed Bus | Emits post.created event to partition 0 | 3ms
Elasticsearch | Search Cluster | Inverted index update for full-text search | 15ms
\`\`\`

## API Handshake Sequence
The sequence diagram below details the authentication and write acknowledgment flow:

\`\`\`mermaid
sequenceDiagram
  autonumber
  actor User as Engineer
  participant GW as Edge Gateway
  participant Auth as Auth Microservice
  participant Cache as Redis Cache
  participant DB as Primary PostgreSQL
  User->>GW: POST /api/v1/blogs
  GW->>Auth: Verify JWT & Permissions
  Auth-->>GW: 200 OK (userId: "eng-101")
  GW->>DB: INSERT into "Blog" table
  DB-->>GW: 201 Created (id: "b-55")
  GW->>Cache: Set "blog:b-55" (TTL: 3600s)
  GW-->>User: { status: "created", id: "b-55" }
\`\`\`

## Live Concurrency & Capacity Sandbox
Test our throughput capacity calculations live directly in your browser:

\`\`\`sandbox
// Live In-Browser System Capacity Calculator (Little's Law)
function calculateSystemCapacity(requestsPerSec, avgLatencyMs, maxWorkers) {
  console.log("Evaluating system health...");
  console.log("Incoming RPS:", requestsPerSec);
  console.log("Average Service Latency:", avgLatencyMs + "ms");
  
  // Little's Law: L = λ * W
  const requiredConcurrency = (requestsPerSec * avgLatencyMs) / 1000;
  const utilization = (requiredConcurrency / maxWorkers) * 100;

  console.log("Required Active Connections:", Math.ceil(requiredConcurrency));
  console.log("Worker Pool Utilization:", utilization.toFixed(1) + "%");

  if (utilization > 80) {
    console.warn("WARNING: Worker pool exceeding 80% threshold! Scaling recommended.");
  } else {
    console.log("HEALTHY: System operating well within capacity limits ✓");
  }

  return { requiredConcurrency: Math.ceil(requiredConcurrency), utilization: utilization.toFixed(1) + "%" };
}

const report = calculateSystemCapacity(4500, 16, 128);
console.log("Capacity Analysis Report:", report);
\`\`\`

## Trade-offs & Production Bottlenecks
When choosing between synchronous write-through caching versus asynchronous message broker queues, engineers must weigh consistency against availability:
- **Strong Consistency**: Slower write paths due to synchronous double-writes.
- **Eventual Consistency**: Near-instant write response times with millisecond replication lag for read replicas.
`
};

function RenderBlock({ block }: { block: ContentBlock }) {
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
      return (
        <SystemDesignFlow
          title={block.title}
          steps={block.steps}
        />
      );

    case "paragraph":
      return (
        <p className="leading-relaxed text-sm sm:text-base" style={{ color: "var(--text)" }}>
          {block.text}
        </p>
      );

    case "html":
      return (
        <div
          className="leading-relaxed text-sm sm:text-base prose-content"
          style={{ color: "var(--text)" }}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    default:
      return null;
  }
}

export const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDemo = id === "demo";
  const { loading, blog: fetchedBlog, error, refetch } = useBlog({ id: isDemo ? "" : id || "" });
  const { user } = useCurrentUser();
  const [deleting, setDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const blog = isDemo ? DEMO_ENGINEERING_BLOG : fetchedBlog;

  const { blocks, tocItems } = useMemo(() => {
    if (!blog) return { blocks: [], tocItems: [] };
    return parseBlogContent(blog.content);
  }, [blog]);

  // Loading state
  if (loading && !isDemo) {
    return (
      <div
        className="min-h-screen font-mono flex flex-col transition-colors"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <AnnouncementBar />
        <BlogNav />
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  // Error state / not found
  if (!isDemo && (error || !blog)) {
    return (
      <div
        className="min-h-screen font-mono flex flex-col transition-colors"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <AnnouncementBar />
        <BlogNav />
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text)" }}
          >
            Blog Post Not Found
          </h2>
          <p
            className="max-w-md mb-6 text-sm"
            style={{ color: "var(--text-dim)" }}
          >
            The article you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/blog/demo"
              className="px-5 py-2.5 rounded text-sm font-bold text-white transition hover:opacity-90 shadow"
              style={{ backgroundColor: "var(--accent)" }}
            >
              ▶ View Interactive Engineering Demo Post
            </Link>
            <button
              onClick={refetch}
              className="px-5 py-2.5 rounded text-sm font-bold border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text)",
              }}
            >
              Retry
            </button>
            <Link
              to="/blogs"
              className="px-5 py-2.5 rounded text-sm font-bold border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              Back to Stories
            </Link>
          </div>
        </div>
        <BlogFooter />
      </div>
    );
  }

  if(!blog){
    return null;
  }

  const authorName =
    blog.author?.name || blog.author?.username || "Anonymous";

  const isAuthor =
    !isDemo &&
    !!user &&
    (blog.authorId === user.id || blog.author?.username === user.username);

  const cleanContent = blog.content.replace(/<[^>]*>?/gm, "");
  const wordCount = cleanContent.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/v1/blogs/${blog.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      navigate("/blogs");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(
            err.response?.data?.message ||
              "Failed to delete post"
          );
        } else {
          alert("Failed to delete post");
        }

        setDeleting(false);
      }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="min-h-screen font-mono transition-colors"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
          {/* Article column */}
          <article className="min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Engineering Insights", href: "/blogs" },
                { label: blog.title || "Untitled" },
              ]}
            />

            <BlogTitle
              title={blog.title || "Untitled"}
              authors={[authorName]}
              date={isDemo ? "Interactive Demo Post" : "Published"}
              readTime={`${readTime} min read`}
              isAuthor={isAuthor}
              onDelete={handleDelete}
              deleting={deleting}
              editHref={isDemo ? `/publish` : `/edit/${blog.id}`}
            />

            {/* Article body */}
            <div className="space-y-4 text-base leading-relaxed">
              {blocks.map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))}
            </div>

            {/* Bottom Article Actions */}
            <div
              className="mt-12 pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <Avatar name={authorName} size="medium" />
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                    Written by {authorName}
                  </p>
                  <p style={{ color: "var(--text-dim)" }}>
                    Software Engineer & Technical Architecture Contributor.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/publish"
                  className="px-3.5 py-1.5 rounded text-white font-bold transition hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  ✍️ Write Your Own Post
                </Link>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded border font-bold transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text)",
                  }}
                >
                  {copiedLink ? "✓ Link Copied!" : "🔗 Share Article"}
                </button>
              </div>
            </div>
          </article>

          {/* Right rail — Sticky TOC & Architecture Sidebar */}
          <div className="hidden lg:block space-y-8">
            {tocItems.length > 0 && (
              <div className="sticky top-24">
                <TableOfContents items={tocItems} />

                {/* Author / Engineering Architecture Card */}
                <div
                  className="mt-8 p-4 rounded-lg border text-xs"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p
                    className="uppercase tracking-widest font-bold mb-3"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Engineering Specs
                  </p>
                  <div className="space-y-2 text-[11px]" style={{ color: "var(--text-dim)" }}>
                    <div className="flex justify-between">
                      <span>Diagrams:</span>
                      <strong style={{ color: "var(--text)" }}>Mermaid Vector SVG</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sandbox:</span>
                      <strong style={{ color: "var(--accent)" }}>Live In-Browser</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Flow Walkthrough:</span>
                      <strong style={{ color: "var(--syn-string)" }}>Step-by-step</strong>
                    </div>
                  </div>

                  <div className="border-t my-3" style={{ borderColor: "var(--border)" }} />

                  <div className="flex items-center gap-2">
                    <Avatar name={authorName} size="small" />
                    <div>
                      <h4 className="font-bold text-xs" style={{ color: "var(--text)" }}>
                        {authorName}
                      </h4>
                      <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                        @{blog.author?.username || "author"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};

export default BlogPostPage;
