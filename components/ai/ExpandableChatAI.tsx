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
  "How do I submit a project?",
  "What SDGs do projects address?",
];

export function ExpandableChatAI() {
  const { messages, isLoading, sendMessage } = useChat();
  const [open, setOpen]           = useState(false);
  const [visible, setVisible]     = useState(false);
  const [input, setInput]         = useState("");
  const [focused, setFocused]     = useState(false);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPanel = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    setTimeout(() => inputRef.current?.focus(), 180);
  }, []);

  const closePanel = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 260);
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
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .chat-msg { animation: msgIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        .chat-body::-webkit-scrollbar { width: 4px; }
        .chat-body::-webkit-scrollbar-track { background: transparent; }
        .chat-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

      {/* ── FAB ─────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{
          background:  'linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)',
          boxShadow:   '0 4px 16px rgba(37,99,235,0.25), 0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {open
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            }
          </svg>
        </div>
      </button>

      {/* ── Panel ───────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden"
          style={{
            height:          520,
            background:      'rgba(5,5,11,0.98)',
            border:          '1px solid rgba(255,255,255,0.09)',
            boxShadow:       '0 32px 80px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
            opacity:         visible ? 1 : 0,
            transform:       visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
            transformOrigin: 'bottom right',
            transition:      'opacity 0.26s cubic-bezier(0.16,1,0.3,1), transform 0.26s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent pointer-events-none z-10" />

          {/* ── Header ──────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
            style={{
              background:   'linear-gradient(135deg, rgba(29,78,216,0.22) 0%, transparent 65%)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.35),rgba(29,78,216,0.18))', border: '1px solid rgba(59,130,246,0.28)' }}
              >
                <img src="/iconw.svg" alt="" className="w-5 h-5 opacity-90" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-white tracking-[-0.01em]">SDGP Assistant</span>
                </div>
                <p className="text-[11px] text-white/32 mt-0.5">Powered by AI · Ask anything</p>
              </div>
            </div>
            <button
              onClick={closePanel}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/65 transition-colors"
              style={{ background: 'rgba(255,255,255,0)', transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0)')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Messages ────────────────────────────────────── */}
          <div ref={bodyRef} className="chat-body flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, idx) => (
              <div key={m.id} className={`chat-msg flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>

                {m.sender === "ai" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.28),rgba(29,78,216,0.14))', border: '1px solid rgba(59,130,246,0.22)' }}
                  >
                    <img src="/iconw.svg" alt="" className="w-4 h-4 opacity-85" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] text-[13px] leading-relaxed ${m.sender === "user" ? "rounded-2xl rounded-tr-sm text-white" : "rounded-2xl rounded-tl-sm text-gray-200"}`}
                  style={m.sender === "user"
                    ? { background: 'linear-gradient(135deg,#3b82f6 0%,#1e40af 100%)', padding: '9px 14px' }
                    : { background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)', padding: '9px 14px' }
                  }
                >
                  {m.sender === "ai" ? (
                    <>
                      <MarkdownAnswer content={m.content} />
                      {idx === 0 && showSuggestions && (
                        <div className="flex flex-col gap-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="text-[10px] uppercase tracking-wider text-white/25 mb-0.5">Try asking</p>
                          {SUGGESTIONS.map(s => (
                            <button
                              key={s}
                              onClick={() => sendMessage(s)}
                              className="text-left text-[12px] text-blue-300/75 hover:text-blue-200 px-3 py-2 rounded-lg transition-all duration-150"
                              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.14)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.28)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.14)'; }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="chat-msg flex gap-2.5 justify-start">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.28),rgba(29,78,216,0.14))', border: '1px solid rgba(59,130,246,0.22)' }}
                >
                  <img src="/iconw.svg" alt="" className="w-4 h-4 opacity-85" />
                </div>
                <div
                  className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70 animate-bounce" style={{ animationDelay: '0ms',   animationDuration: '0.9s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70 animate-bounce" style={{ animationDelay: '160ms', animationDuration: '0.9s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70 animate-bounce" style={{ animationDelay: '320ms', animationDuration: '0.9s' }} />
                </div>
              </div>
            )}
          </div>

          {/* ── Input ───────────────────────────────────────── */}
          <div
            className="px-3 pb-3 pt-2.5 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <form
              onSubmit={send}
              className="flex items-center gap-2"
              style={{
                background:    'rgba(255,255,255,0.03)',
                border:        focused ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius:  14,
                padding:       '6px 6px 6px 14px',
                transition:    'border-color 0.18s',
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                onFocus={() => setFocused(true)}
                onBlur={()  => setFocused(false)}
                placeholder="Ask anything about SDGP…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder-white/22 outline-none min-w-0"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send"
                className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-150"
                style={{
                  background: canSend ? 'linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)' : 'rgba(255,255,255,0.06)',
                  opacity:    canSend ? 1 : 0.45,
                  transform:  canSend ? 'scale(1)' : 'scale(0.92)',
                  boxShadow:  canSend ? '0 2px 12px rgba(37,99,235,0.4)' : 'none',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
            <p className="text-center text-[10px] text-white/14 mt-2 tracking-wide">
              SDGP AI · Powered by Anthropic Claude
            </p>
          </div>
        </div>
      )}
    </>
  );
}
