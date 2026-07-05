// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { CONSENT_KEY, TOOLTIP_KEY, MAX_LEN } from "@/lib/constants/chat";

type Message = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "Show me featured AI projects",
  "What healthtech projects exist?",
  "Suggest an AI project idea",
];

const LOGO_SRC = "/iconw.svg";

function BotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="8" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="9" cy="14" r="1.3" fill="currentColor" />
      <circle cx="15" cy="14" r="1.3" fill="currentColor" />
      <path d="M2 13h2M20 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 4v5h5M20 20v-5h-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 15a8 8 0 0014.5 3.5M19.5 9A8 8 0 005 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 12l16-7-6 16-2.5-6.5L4 12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function greetingForTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function ChatBot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [consented, setConsented] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setConsented(localStorage.getItem(CONSENT_KEY) === "true");
    setShowTooltip(localStorage.getItem(TOOLTIP_KEY) !== "true");
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function acceptConsent() {
    localStorage.setItem(CONSENT_KEY, "true");
    setConsented(true);
  }

  function dismissTooltip() {
    localStorage.setItem(TOOLTIP_KEY, "true");
    setShowTooltip(false);
  }

  function resetChat() {
    setMessages([]);
    setInput("");
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    dismissTooltip();
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply ?? "Something went wrong." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Couldn't reach the server. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-0 right-0 z-[9999] flex flex-col items-end font-sans sm:bottom-5 sm:right-5">
      {open && (
        <div className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen flex-col overflow-hidden bg-black text-white sm:static sm:z-auto sm:mb-3 sm:h-[min(600px,calc(100dvh-6rem))] sm:w-[380px] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                <Image
                  src={LOGO_SRC}
                  alt="Logo"
                  width={22}
                  height={22}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">SDGP Assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={resetChat}
              aria-label="Restart chat"
              className="rounded-full p-1.5 text-white/50 hover:bg-white/10"
            >
              <RefreshIcon className="h-4 w-4" />
            </button>
          </div>

          {!consented ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <ShieldCheckIcon className="h-8 w-8" />
              <p className="text-base font-semibold">We value your privacy</p>
              <p className="text-sm leading-relaxed text-white/50">
                Messages are sent to our AI assistant to help answer your question. By continuing, you agree to our data policy.
              </p>
              <button
                onClick={acceptConsent}
                className="mt-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black"
              >
                Accept &amp; Chat
              </button>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center pt-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <BotIcon className="h-7 w-7" />
                    </div>
                    <p className="text-sm text-white/50">{greetingForTime()} 👋</p>
                    <p className="mt-1 text-xl font-semibold">Hey there!</p>
                    <p className="mt-1 text-sm text-white/50">Ask me anything about SDGP projects.</p>

                    <div className="mt-6 w-full space-y-2">
                      {STARTER_PROMPTS.map((p) => (
                        <button
                          key={p}
                          onClick={() => send(p)}
                          className="block w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm hover:bg-white/5"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-white text-black" : "mr-auto bg-white/[0.06] text-white/90"
                        }`}
                    >
                      {m.role === "assistant" ? (
                        <ReactMarkdown
                          components={{
                            p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({ ...props }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0" {...props} />,
                            ol: ({ ...props }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0" {...props} />,
                            li: ({ ...props }) => <li {...props} />,
                            strong: ({ ...props }) => <strong className="font-semibold text-white" {...props} />,
                            a: ({ ...props }) => (
                              <a className="text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  ))
                )}

                {loading && (
                  <div className="mr-auto max-w-[85%] rounded-2xl bg-white/[0.06] px-3.5 py-2.5 text-sm text-white/90">
                    Thinking…
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 px-4 pb-3 pt-3">
                {showTooltip && messages.length === 0 && (
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-white/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Type your question here
                    </span>
                    <button onClick={dismissTooltip} className="text-xs text-white/50 underline">
                      skip
                    </button>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                      placeholder="Message..."
                      aria-label="Message"
                      maxLength={MAX_LEN}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-14 text-sm text-white outline-none focus:border-blue-500"
                    />
                    <span className="pointer-events-none absolute bottom-1.5 right-3 text-[10px] text-white/50">
                      {input.length}/{MAX_LEN}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Send"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-black disabled:opacity-40"
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </form>

                <p className="mt-2 text-center text-[11px] text-white/50">powered by SDGP.LK</p>
              </div>
            </>
          )}
        </div>
      )}

      {open && (
        <button
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="fixed right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white sm:hidden"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
        className={`${open ? "hidden sm:flex" : "flex"} mb-5 mr-5 h-14 w-14 items-center justify-center rounded-full border border-blue-500/50 bg-black text-white shadow-xl transition hover:scale-105 hover:border-blue-500 sm:mb-0 sm:mr-0`}
      >
        {open ? <XIcon className="h-5 w-5" /> : <BotIcon className="h-6 w-6" />}
      </button>
    </div>,
    document.body
  );
}