"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/rate-limit-status")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining))
      .catch(() => {});
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setRemaining(data.remaining ?? null);

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.response || data.error || "No response" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-medium text-[var(--foreground)] tracking-tight">
                AI Assistant
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wider">
                  Online
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-xs font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-md hover:bg-[var(--surface-2)]"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto py-8 flex flex-col gap-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--foreground-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-[var(--foreground)] mb-2">
                Start a conversation
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] max-w-sm">
                Ask me anything. I&apos;m here to help with your questions and tasks.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex w-full animate-fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`chat-bubble ${msg.role === "user" ? "chat-user" : "chat-ai"}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                    <div className="w-5 h-5 rounded-md bg-[var(--primary)]/20 flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                      AI Assistant
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex w-full justify-start animate-fade-in">
              <div className="chat-bubble chat-ai">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                  <div className="w-5 h-5 rounded-md bg-[var(--primary)]/20 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    AI Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-pulse"></span>
                  <span className="inline-block w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-pulse delay-75"></span>
                  <span className="inline-block w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-pulse delay-150"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="w-full pl-4 pr-28 py-3.5 bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--background)] transition-all rounded-xl text-sm shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-4 py-2 text-xs rounded-lg"
              disabled={loading || !input.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          {remaining !== null && (
            <div className="text-center mt-3">
              <span className="text-[10px] text-[var(--foreground-subtle)] tracking-wide">
                {remaining} {remaining === 1 ? "request" : "requests"} remaining
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}