"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/components/error/ErrorPage";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error.tsx must include its own <html> and <body> tags
// because it replaces the root layout when that layout itself crashes.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --green-50: #f0faf0; --green-100: #d4f0d2; --green-200: #a8e0a4;
            --green-400: #4ea84e; --green-600: #2a7a2a; --green-700: #1f5e1f;
            --green-800: #163e16; --green-900: #0c260c;
            --earth-300: #c8a265; --earth-500: #8b6035; --cream: #fefcf8;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; background: var(--cream); }
          .font-display { font-family: 'Playfair Display', serif; }
        `}</style>
      </head>
      <body>
        <ErrorPage type="generic" reset={reset} />
      </body>
    </html>
  );
}