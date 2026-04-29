// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";
import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { useChat } from "@/components/ai/useChat";
import { MarkdownAnswer } from "@/components/ai/MarkdownAnswer";

const SUGGESTIONS = [
  "What is SDGP?",
  "How to submit a project?",
  "What SDGs are addressed?",
  "See winning teams",
];

export function ExpandableChatAI() {
  const { messages, isLoading, sendMessage } = useChat();
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [input, setInput]     = useState("");
  const [focused, setFocused] = useState(false);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPanel = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  const closePanel = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 280);
  }, []);

  const toggle = () => (open ? closePanel() : openPanel());

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const canSend         = input.trim().length > 0 && !isLoading;
  const showSuggestions = messages.length === 1 && !isLoading;

  return (
    <>
      <style>{`
        @keyframes chatIn  { from { opacity:0; transform:translateY(10px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes msgIn   { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dotBounce { 0%,80%,100% { transform:translateY(0); opacity:0.4; } 40% { transform:translateY(-5px); opacity:1; } }
        .chat-panel  { animation: chatIn 0.28s cubic-bezier(0.16,1,0.3,1) both; }
        .chat-msg    { animation: msgIn 0.2s cubic-bezier(0.16,1,0.3,1) both; }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }
        .dot-1 { animation: dotBounce 1.2s infinite 0ms; }
        .dot-2 { animation: dotBounce 1.2s infinite 160ms; }
        .dot-3 { animation: dotBounce 1.2s infinite 320ms; }
      `}</style>

      {/* ── FAB ─────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: open
            ? '0 4px 20px rgba(37,99,235,0.3)'
            : '0 4px 24px rgba(37,99,235,0.35), 0 1px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <div style={{ transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>
            }
          </svg>
        </div>
      </button>

      {/* ── Panel ───────────────────────────────────────────────── */}
      {open && (
        <div
          className="chat-panel fixed bottom-[76px] right-6 z-50 flex flex-col rounded-2xl overflow-hidden w-[360px] max-w-[calc(100vw-1.5rem)]"
          style={{
            height: 500,
            background: 'rgb(8,8,16)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.04)',
            opacity:   visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            className="flex-shrink-0 px-4 pt-4 pb-3.5 flex items-center justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(37,99,235,0.12) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(145deg,#2563eb,#1e3a8a)', boxShadow: '0 2px 8px rgba(37,99,235,0.4)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                <img src="/iconw.svg" alt="" className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-white leading-none mb-1">SDGP Assistant</p>
                <p className="text-[11px] text-white/35 leading-none">Ask anything about projects & SDGs</p>
              </div>
            </div>
            <button
              onClick={closePanel}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="chat-scroll flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3">
            {messages.map((m, idx) => (
              <div key={m.id} className={`chat-msg flex items-end gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <div
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mb-0.5"
                    style={{ background: 'linear-gradient(145deg,rgba(37,99,235,0.4),rgba(30,58,138,0.2))', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <img src="/iconw.svg" alt="" className="w-3.5 h-3.5 opacity-80" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] text-[13px] leading-[1.6] ${m.sender === "user" ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}`}
                  style={m.sender === "user"
                    ? { background: 'linear-gradient(145deg,#2563eb,#1e3a8a)', color: '#fff', padding: '8px 13px', boxShadow: '0 2px 12px rgba(37,99,235,0.25)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.07)', padding: '8px 13px' }
                  }
                >
                  {m.sender === "ai" ? (
                    <>
                      <MarkdownAnswer content={m.content} />
                      {idx === 0 && showSuggestions && (
                        <div className="mt-3 pt-2.5 flex flex-wrap gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          {SUGGESTIONS.map(s => (
                            <button
                              key={s}
                              onClick={() => sendMessage(s)}
                              className="text-[11.5px] font-medium text-blue-300/70 hover:text-blue-200 px-2.5 py-1 rounded-full transition-all duration-150"
                              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.18)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.18)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-msg flex items-end gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mb-0.5"
                  style={{ background: 'linear-gradient(145deg,rgba(37,99,235,0.4),rgba(30,58,138,0.2))', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <img src="/iconw.svg" alt="" className="w-3.5 h-3.5 opacity-80" />
                </div>
                <div
                  className="flex items-center gap-1 px-3.5 py-3 rounded-2xl rounded-bl-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="dot-1 w-[5px] h-[5px] rounded-full bg-blue-400/60 inline-block" />
                  <span className="dot-2 w-[5px] h-[5px] rounded-full bg-blue-400/60 inline-block" />
                  <span className="dot-3 w-[5px] h-[5px] rounded-full bg-blue-400/60 inline-block" />
                </div>
              </div>
            )}
          </div>

          {/* Fade into input */}
          <div className="pointer-events-none absolute left-0 right-0 h-8" style={{ bottom: 64, background: 'linear-gradient(to top, rgb(8,8,16), transparent)' }} />

          {/* Input */}
          <div className="flex-shrink-0 px-3 pb-3 pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <form
              onSubmit={send}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: focused ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.08)' : 'none',
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Ask anything…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/20 outline-none min-w-0"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send"
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{
                  background: canSend ? 'linear-gradient(145deg,#2563eb,#1e3a8a)' : 'rgba(255,255,255,0.05)',
                  opacity: canSend ? 1 : 0.4,
                  boxShadow: canSend ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
