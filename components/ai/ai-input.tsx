"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => Promise<void>;
}

export function AIInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) return;

    await onSend(message);

    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Mkulima AI..."
          className="flex-1 rounded-xl border p-3"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-700 px-6 text-white"
        >
          Send
        </button>
      </div>
    </form>
  );
}
