// components/blog/TableOfContents.tsx
'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const extractedHeadings: TocItem[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    doc.querySelectorAll('h2, h3').forEach((heading) => {
      const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      extractedHeadings.push({
        id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-24 self-start w-72 pl-8 border-l border-green-100">
      <h4 className="font-medium text-green-800 mb-4">In this article</h4>
      <nav className="space-y-3 text-sm">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block transition-colors hover:text-green-700 ${
              activeId === heading.id ? 'text-green-700 font-medium' : 'text-green-600'
            }`}
            style={{ paddingLeft: heading.level === 3 ? '1.25rem' : '0' }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}