/* Copyright (c) 2025, the contributors of the SDGP Connect project. All Rights Reserved.

This software is the joint property of the contributors to the SDGP Connect project.
Unauthorized distribution, commercial use, or reproduction of any part of this material
in any form is strictly prohibited without the explicit written consent of all contributors.
You may not alter or remove any copyright or attribution notice from this content. */

"use client";
import { useState, FormEvent } from "react";
import { Bot, Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { useChat } from "@/components/ai/useChat";
import { MarkdownAnswer } from "@/components/ai/MarkdownAnswer";

export function ExpandableChatAI() {
  const { messages, isLoading, sendMessage, showThink, setShowThink } = useChat();
  const [input, setInput] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };
  
  return (
    <ExpandableChat 
      size="lg" 
      position="bottom-right" 
      icon={<Bot className="h-6 w-6" />}
      className="mb-16 md:mb-4"
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Chat with AI</h1>
        <p className="text-sm text-muted-foreground">
          Ask me anything about the platform or components
        </p>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList aria-label="Chat messages" aria-live="polite">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === "user"
                    ? "/user.png"
                    : "/iconw.svg"
                }
                fallback={message.sender === "user" ? "US" : "AI"}
                aria-label={message.sender === "user" ? "User avatar" : "AI avatar"}
              />
              <ChatBubbleMessage variant={message.sender === "user" ? "sent" : "received"}>
                {message.sender === "ai" ? (
                  <MarkdownAnswer content={message.content} />
                ) : (
                  message.content
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar className="h-8 w-8 shrink-0" src="/iconw.svg" fallback="AI" aria-label="AI avatar" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          role="form"
          aria-label="Send a message to the AI chat"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            aria-label="Type your message"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <Button type="submit" size="sm" className="ml-auto gap-1.5" aria-label="Send message">
              Send Message
              <CornerDownLeft className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}