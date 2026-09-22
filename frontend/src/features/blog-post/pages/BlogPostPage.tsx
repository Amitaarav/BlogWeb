import {
  AnnouncementBar,
  BlogNav,
  Breadcrumb,
  BlogTitle,
  CodeBlock,
  TableOfContents,
  BlogFooter,
} from "../index";
import type { TocItem } from "../index";

// ── Sample data ──────────────────────────────────────────────

const tocItems: TocItem[] = [
  { id: "introduction", label: "Introduction", level: 2 },
  { id: "why-it-matters", label: "Why It Matters", level: 3 },
  { id: "getting-started", label: "Getting Started", level: 2 },
  { id: "installation", label: "Installation", level: 3 },
  { id: "project-setup", label: "Project Setup", level: 3 },
  { id: "core-concepts", label: "Core Concepts", level: 2 },
  { id: "components", label: "Components", level: 3 },
  { id: "state-management", label: "State Management", level: 3 },
  { id: "advanced-patterns", label: "Advanced Patterns", level: 2 },
  { id: "conclusion", label: "Conclusion", level: 2 },
];

const sampleCodeInstall = `npm install @blogweb/cli @blogweb/core
# or with yarn
yarn add @blogweb/cli @blogweb/core`;

const sampleCodeComponent = `import { useState } from "react";
import { BlogEngine } from "@blogweb/core";

export function PostEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const engine = new BlogEngine({ theme: "minimal" });

  // Parse markdown and render preview
  const preview = engine.render(content);

  return (
    <div className="editor-container">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div dangerouslySetInnerHTML={{ __html: preview }} />
    </div>
  );
}`;

const sampleCodeState = `const usePostStore = create((set) => ({
  posts: [],
  loading: false,

  fetchPosts: async () => {
    set({ loading: true });
    const response = await fetch("/api/posts");
    const posts = await response.json();
    set({ posts, loading: false });
  },

  addPost: (post) =>
    set((state) => ({
      posts: [...state.posts, post],
    })),
}));`;

// ── Page ─────────────────────────────────────────────────────

export const BlogPostPage = () => {
  return (
    <div
      className="min-h-screen font-mono"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
          {/* Article column */}
          <article className="min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Engineering", href: "/blogs" },
                { label: "Building a Modern Blog Engine" },
              ]}
            />

            <BlogTitle
              title="Building a Modern Blog Engine with React and TypeScript"
              authors={["Amit Kumar", "Aarav Singh"]}
              date="Sep 17, 2026"
            />

            {/* ── Article body ── */}
            <div className="space-y-6 text-base leading-relaxed">
              {/* Introduction */}
              <section>
                <h2
                  id="introduction"
                  className="text-2xl font-bold mt-10 mb-4"
                  style={{ color: "var(--text)" }}
                >
                  Introduction
                </h2>
                <p style={{ color: "var(--text)" }}>
                  Building a blog engine from scratch might seem like reinventing the wheel,
                  but it offers unparalleled control over the authoring experience, rendering
                  pipeline, and content delivery. In this deep-dive, we'll walk through the
                  architecture decisions, component design, and state management patterns
                  that power a production-grade blog platform.
                </p>

                <h3
                  id="why-it-matters"
                  className="text-lg font-bold mt-8 mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Why It Matters
                </h3>
                <p style={{ color: "var(--text)" }}>
                  Off-the-shelf solutions trade flexibility for convenience. When your content
                  strategy demands custom embeds, real-time collaboration, or edge-rendered
                  previews, a bespoke engine pays for itself quickly.
                </p>
              </section>

              {/* Getting Started */}
              <section>
                <h2
                  id="getting-started"
                  className="text-2xl font-bold mt-10 mb-4"
                  style={{ color: "var(--text)" }}
                >
                  Getting Started
                </h2>

                <h3
                  id="installation"
                  className="text-lg font-bold mt-8 mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Installation
                </h3>
                <p style={{ color: "var(--text)" }}>
                  Start by installing the CLI and core packages. The CLI scaffolds
                  a new project with sensible defaults, while the core library handles
                  markdown parsing and rendering.
                </p>
                <CodeBlock code={sampleCodeInstall} language="bash" />

                <h3
                  id="project-setup"
                  className="text-lg font-bold mt-8 mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Project Setup
                </h3>
                <p style={{ color: "var(--text)" }}>
                  After installation, run <code className="px-1.5 py-0.5 rounded text-sm"
                  style={{ backgroundColor: "var(--bg-code)" }}>blogweb init</code> to
                  generate the config file, content directory, and template structure.
                  The defaults target a Vite + React setup, but you can pass{" "}
                  <code className="px-1.5 py-0.5 rounded text-sm"
                  style={{ backgroundColor: "var(--bg-code)" }}>--framework next</code>{" "}
                  for Next.js compatibility.
                </p>
              </section>

              {/* Core Concepts */}
              <section>
                <h2
                  id="core-concepts"
                  className="text-2xl font-bold mt-10 mb-4"
                  style={{ color: "var(--text)" }}
                >
                  Core Concepts
                </h2>

                <h3
                  id="components"
                  className="text-lg font-bold mt-8 mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Components
                </h3>
                <p style={{ color: "var(--text)" }}>
                  The editor is built as a controlled React component. The{" "}
                  <code className="px-1.5 py-0.5 rounded text-sm"
                  style={{ backgroundColor: "var(--bg-code)" }}>BlogEngine</code>{" "}
                  class accepts a theme config and exposes a <code className="px-1.5 py-0.5 rounded text-sm"
                  style={{ backgroundColor: "var(--bg-code)" }}>render()</code> method
                  that transforms markdown into sanitized HTML.
                </p>
                <CodeBlock code={sampleCodeComponent} language="typescript" />

                <h3
                  id="state-management"
                  className="text-lg font-bold mt-8 mb-3"
                  style={{ color: "var(--text)" }}
                >
                  State Management
                </h3>
                <p style={{ color: "var(--text)" }}>
                  We use a lightweight store pattern inspired by Zustand. The store holds
                  the post list, loading states, and exposes actions for fetching and
                  creating posts — all without the boilerplate of Redux.
                </p>
                <CodeBlock code={sampleCodeState} language="typescript" />
              </section>

              {/* Advanced Patterns */}
              <section>
                <h2
                  id="advanced-patterns"
                  className="text-2xl font-bold mt-10 mb-4"
                  style={{ color: "var(--text)" }}
                >
                  Advanced Patterns
                </h2>
                <p style={{ color: "var(--text)" }}>
                  For large-scale deployments, consider implementing ISR (Incremental Static
                  Regeneration) for blog pages. This gives you the performance benefits of
                  static generation while keeping content fresh. Pair it with a webhook that
                  triggers revalidation on content updates, and you get the best of both
                  worlds — static speed with dynamic freshness.
                </p>
                <p style={{ color: "var(--text)" }}>
                  Another pattern worth adopting is content-layer decoupling: keep your raw
                  markdown in a headless CMS or Git repo, and let the build pipeline pull,
                  transform, and deploy. This separation makes it easy to swap rendering
                  engines, add i18n layers, or migrate between frameworks without touching
                  content.
                </p>
              </section>

              {/* Conclusion */}
              <section>
                <h2
                  id="conclusion"
                  className="text-2xl font-bold mt-10 mb-4"
                  style={{ color: "var(--text)" }}
                >
                  Conclusion
                </h2>
                <p style={{ color: "var(--text)" }}>
                  Building your own blog engine is a rewarding exercise that sharpens your
                  understanding of rendering pipelines, state management, and component
                  architecture. Start small with a markdown-to-HTML renderer, layer on
                  features iteratively, and deploy with confidence knowing you control every
                  line of the stack.
                </p>
                <p className="mt-4" style={{ color: "var(--text-dim)" }}>
                  Have questions or feedback?{" "}
                  <a
                    href="#"
                    className="underline hover:no-underline"
                    style={{ color: "var(--link)" }}
                  >
                    Open an issue on GitHub
                  </a>{" "}
                  or reach out on{" "}
                  <a
                    href="#"
                    className="underline hover:no-underline"
                    style={{ color: "var(--link)" }}
                  >
                    Discord
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>

          {/* Right rail — TOC */}
          <div className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};
