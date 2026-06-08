"use client";

import { useState } from "react";

import { AIInput } from "./ai-input";
import { AIMessage } from "./ai-message";
import { AILoading } from "./ai-loading";
import { AIEmptyState } from "./ai-empty-state";

type Message = {
  role: "user" | "assistant";
  content: string;
  products?: any[];
};

export function AIChat() {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage(question: string) {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question,

          context: {
            pathname: window.location.pathname,
          },
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          products: data.products,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[80vh] flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <AIEmptyState onSelect={sendMessage} />
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <AIMessage
                key={index}
                role={message.role}
                content={message.content}
                products={message.products}
              />
            ))}

            {loading && <AILoading />}
          </div>
        )}
      </div>

      <AIInput onSend={sendMessage} />
    </div>
  );
}
