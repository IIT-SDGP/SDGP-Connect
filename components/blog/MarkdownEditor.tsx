// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Image
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    onChange(newText);

    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    // Find the start of the current line
    const lastNewline = beforeCursor.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newText);

    // Set cursor position after the prefix
    setTimeout(() => {
      const newCursorPos = start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatButtons = [
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => insertAtLineStart("# "),
    },
    {
      icon: Heading2,
      title: "Heading 2", 
      action: () => insertAtLineStart("## "),
    },
    {
      icon: Heading3,
      title: "Heading 3",
      action: () => insertAtLineStart("### "),
    },
    {
      icon: Bold,
      title: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    {
      icon: Code,
      title: "Inline Code",
      action: () => insertText("`", "`", "code"),
    },    {
      icon: Link,
      title: "Link",
      action: () => insertText("[", "](url)", "link text"),
    },
    {
      icon: Image,
      title: "Image",
      action: () => insertText("![", "](image-url)", "alt text"),
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => insertAtLineStart("- "),
    },
    {
      icon: ListOrdered,
      title: "Numbered List",
      action: () => insertAtLineStart("1. "),
    },
    {
      icon: Quote,
      title: "Blockquote",
      action: () => insertAtLineStart("> "),
    },
    {
      icon: Minus,
      title: "Horizontal Rule",
      action: () => insertText("\n---\n"),
    },
  ];

  const insertCodeBlock = () => {
    insertText("\n```\n", "\n```\n", "code block");
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={insertCodeBlock}
          title="Code Block"
          className="h-8 px-2 text-xs"
        >
          {}
        </Button>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`font-mono ${className}`}
      />
    </div>
  );
}
