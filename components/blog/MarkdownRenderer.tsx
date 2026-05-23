// components/blog/MarkdownRenderer.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-green-900 prose-p:text-green-700 prose-strong:text-green-800 prose-a:text-green-600 hover:prose-a:text-green-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl md:text-5xl !mt-12 !mb-8" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl !mt-10 !mb-6 border-b border-green-100 pb-4"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl !mt-8 !mb-5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-relaxed mb-6" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-green-500 pl-6 italic text-green-700 my-8"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="rounded-2xl my-8 shadow-md"
              alt={props.alt || ""}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
