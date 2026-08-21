// components/blog/ShareButtons.tsx
"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: "inline" | "floating";
}

const ICONS = {
  whatsapp: {
    color: "#25D366",
    label: "Share on WhatsApp",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.71.45 3.38 1.3 4.85L2.05 22l5.36-1.4a9.9 9.9 0 0 0 4.63 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.07c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98s.75-2.11 1.02-2.4c.26-.28.57-.35.76-.35s.38 0 .55.01c.18.01.42-.07.65.5.24.58.82 2 .9 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.7 1.16 1.51 1.88 1.04.93 1.92 1.22 2.2 1.36.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
      </svg>
    ),
    getHref: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  facebook: {
    color: "#1877F2",
    label: "Share on Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
      </svg>
    ),
    getHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  x: {
    color: "#000000",
    label: "Share on X",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.9 2H22l-7.6 8.68L23.3 22h-6.9l-5.4-6.6L4.7 22H1.6l8.1-9.26L1 2h7.1l4.9 6.03L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
      </svg>
    ),
    getHref: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  linkedin: {
    color: "#0A66C2",
    label: "Share on LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
    getHref: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  instagram: {
    color: "#E1306C",
    label: "Copy link to share on Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.23.41.56.2.96.45 1.38.87.42.42.67.82.87 1.38.17.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.41 2.23-.2.56-.45.96-.87 1.38-.42.42-.82.67-1.38.87-.42.17-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.23-.41-.56-.2-.96-.45-1.38-.87-.42-.42-.67-.82-.87-1.38-.17-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.41-2.23.2-.56.45-.96.87-1.38.42-.42.82-.67 1.38-.87.42-.17 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.8.31-1.48.73-2.15 1.4C1.31 2.7.9 3.38.58 4.18c-.3.76-.5 1.64-.56 2.9C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.14.56 2.9.31.8.73 1.48 1.4 2.15.67.67 1.35 1.09 2.15 1.4.76.3 1.64.5 2.9.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.14-.26 2.9-.56.8-.31 1.48-.73 2.15-1.4.67-.67 1.09-1.35 1.4-2.15.3-.76.5-1.64.56-2.9.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.14-.56-2.9-.31-.8-.73-1.48-1.4-2.15C21.3 1.31 20.62.9 19.82.58c-.76-.3-1.64-.5-2.9-.56C15.67 0 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    ),
    getHref: null, // no web share intent exists for Instagram
  },
} as const;

type Platform = keyof typeof ICONS;

const PLATFORM_ORDER: Platform[] = [
  "whatsapp",
  "facebook",
  "x",
  "linkedin",
  "instagram",
];

export default function ShareButtons({
  url,
  title,
  variant = "inline",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (platform: Platform) => {
    const config = ICONS[platform];

    if (platform === "instagram" || !config.getHref) {
      // Instagram has no web share-intent URL; copy the link instead
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard write failed silently; user can still copy manually
      }
      return;
    }

    const href = config.getHref(url, title);
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const buttonClass =
    variant === "floating"
      ? "flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:brightness-125"
      : "flex h-10 w-10 items-center justify-center rounded-full bg-white border border-black/5 shadow-sm transition hover:brightness-125 hover:shadow-md";

  return (
    <div
      className={
        variant === "floating"
          ? "flex flex-col gap-3"
          : "flex items-center gap-2"
      }
    >
      {PLATFORM_ORDER.map((platform) => {
        const config = ICONS[platform];
        return (
          <button
            key={platform}
            type="button"
            onClick={() => handleClick(platform)}
            aria-label={config.label}
            title={
              platform === "instagram"
                ? copied
                  ? "Link copied!"
                  : "Copy link (paste in your Instagram bio/story)"
                : config.label
            }
            className={buttonClass}
            style={{ color: config.color }}
          >
            {config.svg}
          </button>
        );
      })}
      {variant === "inline" && copied && (
        <span className="ml-1 text-xs font-medium text-green-700">
          Link copied!
        </span>
      )}
    </div>
  );
}
