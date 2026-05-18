"use client";

import React from "react";

interface ErrorPageProps {
  type: "network" | "offline" | "notFound" | "serverError" | "generic";
  reset?: () => void;
  message?: string;
}

const configs = {
  offline: {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--green-200)"
          strokeWidth="2"
        />
        <path
          d="M16 32 Q32 16 48 32"
          stroke="var(--green-400)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 38 Q32 28 42 38"
          stroke="var(--green-400)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="32" cy="44" r="3" fill="var(--green-400)" />
        <line
          x1="12"
          y1="12"
          x2="52"
          y2="52"
          stroke="var(--earth-500)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    heading: "You're offline",
    subtext:
      "No internet connection detected. Check your network and try again.",
    label: "Try again",
    pill: "No Connection",
  },
  network: {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--green-200)"
          strokeWidth="2"
        />
        <path
          d="M16 32 Q32 16 48 32"
          stroke="var(--green-200)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 38 Q32 28 42 38"
          stroke="var(--green-400)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="32" cy="44" r="3" fill="var(--green-600)" />
        <path
          d="M32 22 L32 28 M32 30 L32 32"
          stroke="var(--earth-500)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    heading: "Slow connection",
    subtext:
      "Your connection is unstable or too slow. Things may not load correctly.",
    label: "Retry",
    pill: "Weak Signal",
  },
  notFound: {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--green-200)"
          strokeWidth="2"
        />
        <circle
          cx="28"
          cy="27"
          r="9"
          stroke="var(--green-400)"
          strokeWidth="3"
          fill="none"
        />
        <line
          x1="34"
          y1="34"
          x2="46"
          y2="46"
          stroke="var(--green-400)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24"
          x2="31"
          y2="30"
          stroke="var(--earth-300)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    heading: "Page not found",
    subtext:
      "This page doesn't exist or may have been moved. Double-check the URL.",
    label: "Go home",
    pill: "404",
  },
  serverError: {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--green-200)"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="20"
          width="28"
          height="6"
          rx="2"
          stroke="var(--green-400)"
          strokeWidth="2.5"
          fill="none"
        />
        <rect
          x="18"
          y="29"
          width="28"
          height="6"
          rx="2"
          stroke="var(--green-400)"
          strokeWidth="2.5"
          fill="none"
        />
        <rect
          x="18"
          y="38"
          width="28"
          height="6"
          rx="2"
          stroke="var(--green-200)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="43" cy="23" r="2" fill="var(--earth-500)" />
        <circle cx="43" cy="32" r="2" fill="var(--earth-500)" />
        <circle cx="43" cy="41" r="2" fill="var(--green-200)" />
      </svg>
    ),
    heading: "Server error",
    subtext:
      "Something went wrong on our end. We're working on it — please try again shortly.",
    label: "Try again",
    pill: "500",
  },
  generic: {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--green-200)"
          strokeWidth="2"
        />
        <path
          d="M32 20 L32 36"
          stroke="var(--earth-500)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="32" cy="43" r="2.5" fill="var(--earth-500)" />
      </svg>
    ),
    heading: "Something went wrong",
    subtext:
      "An unexpected error occurred. You can try again or return to the homepage.",
    label: "Try again",
    pill: "Error",
  },
};

export function ErrorPage({ type, reset, message }: ErrorPageProps) {
  const cfg = configs[type];

  const handleAction = () => {
    if (type === "notFound") {
      window.location.href = "/";
    } else if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="error-root">
      <div className="error-card">
        {/* Decorative ring */}
        <div className="icon-ring">
          <div className="icon-ring-inner">{cfg.icon}</div>
        </div>

        {/* Pill */}
        <span className="error-pill">{cfg.pill}</span>

        {/* Text */}
        <h1 className="error-heading font-display">{cfg.heading}</h1>
        <p className="error-subtext">{message || cfg.subtext}</p>

        {/* Actions */}
        <div className="error-actions">
          <button className="btn-primary" onClick={handleAction}>
            {cfg.label}
          </button>
          {type !== "notFound" && (
            <button
              className="btn-ghost"
              onClick={() => (window.location.href = "/")}
            >
              Go home
            </button>
          )}
        </div>
      </div>

      <style>{`
        .error-root {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background texture */
        .error-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 20% 20%, var(--green-100) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 80%, #f5ecd8 0%, transparent 70%);
          opacity: 0.6;
          pointer-events: none;
        }

        .error-card {
          position: relative;
          background: white;
          border: 1px solid var(--green-100);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 32px rgba(42,122,42,0.06),
            0 24px 48px rgba(0,0,0,0.04);
          animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .icon-ring {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: var(--green-50);
          border: 1px solid var(--green-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          animation: ringPulse 3s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(78,168,78,0.15); }
          50%       { box-shadow: 0 0 0 12px rgba(78,168,78,0); }
        }

        .icon-ring-inner {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-pill {
          display: inline-block;
          background: var(--green-100);
          color: var(--green-700);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          margin-bottom: 1rem;
          border: 1px solid var(--green-200);
        }

        .error-heading {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--green-900);
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .error-subtext {
          font-size: 0.9rem;
          color: #5a7060;
          line-height: 1.65;
          margin-bottom: 2rem;
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
        }

        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .btn-primary {
          background: var(--green-600);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-primary:hover { background: var(--green-700); transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          background: transparent;
          color: var(--green-600);
          border: 1px solid var(--green-200);
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-ghost:hover {
          background: var(--green-50);
          border-color: var(--green-400);
        }
      `}</style>
    </div>
  );
}
