// components/blog/TableOfContents.tsx
"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!content) return;

    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");

    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      const text = heading.textContent?.trim() || "";
      
      // Generate or use existing ID
      let id = heading.getAttribute("id");
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        heading.setAttribute("id", id); // Optional: mutate for consistency
      }

      if (text) {
        items.push({ id, text, level });
      }
    });

    setToc(items);
  }, [content]);

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -50% 0px", threshold: 0.5 }
    );

    const headings = document.querySelectorAll("h1, h2, h3");
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (toc.length === 0) return null;

  return (
    <div className="w-72 hidden lg:block sticky top-24 self-start">
      <div className="bg-white border border-green-100 rounded-2xl p-6">
        <h3 className="font-medium text-green-900 mb-4 flex items-center gap-2">
          📖 Table of Contents
        </h3>
        
        <nav className="space-y-1 text-sm">
          {toc.map((item, index) => (
            <a
              key={index}
              href={`#${item.id}`}
              className={`block py-1.5 px-3 rounded-xl transition-all hover:bg-green-50 ${
                activeId === item.id
                  ? "bg-green-100 text-green-800 font-medium"
                  : "text-green-700 hover:text-green-800"
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}