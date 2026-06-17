"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  mode: "login" | "register";
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) =>
    setForm((f) => ({
      ...f,
      [k]: v,
    }));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const payload =
        mode === "register"
          ? {
              name: form.name.trim(),
              email: form.email.trim().toLowerCase(),
              phone: form.phone.trim(),
            }
          : {
              email: form.email.trim().toLowerCase(),
              password: form.password.trim(),
            };

      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const params = new URLSearchParams(window.location.search);

      router.push(params.get("redirect") || "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-all";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      {mode === "register" && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
          Your phone number will automatically become your login password.
        </div>
      )}

      {mode === "login" && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Use your registered phone number as your password when signing in.
        </div>
      )}

      {mode === "register" && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Full Name
          </label>

          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="John Kamau"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Email Address
        </label>

        <input
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.com"
          type="email"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      {mode === "register" && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Phone Number
          </label>

          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="0712345678"
            type="tel"
            className={`mt-1.5 ${inputClass}`}
          />

          <p className="mt-1 text-xs text-gray-500">
            This phone number will be used as your login password.
          </p>
        </div>
      )}

      {mode === "login" && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Phone Number (Password)
          </label>

          <input
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="0712345678"
            type="password"
            className={`mt-1.5 ${inputClass}`}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <p className="mt-1 text-xs text-gray-500">
            Enter the same phone number you registered with.
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#2a7a2a] hover:bg-[#163e16] disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Please wait…
          </>
        ) : mode === "login" ? (
          "Sign In →"
        ) : (
          "Create Account →"
        )}
      </button>
    </div>
  );
}
