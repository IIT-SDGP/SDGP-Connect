// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type ChatBotContextValue = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const ChatBotContext = createContext<ChatBotContextValue | null>(null);

export function ChatBotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);
  const toggleChat = useCallback(() => setOpen((v) => !v), []);

  return (
    <ChatBotContext.Provider value={{ open, openChat, closeChat, toggleChat }}>
      {children}
    </ChatBotContext.Provider>
  );
}

export function useChatBot() {
  const ctx = useContext(ChatBotContext);
  if (!ctx) {
    throw new Error('useChatBot must be used within ChatBotProvider');
  }
  return ctx;
}
