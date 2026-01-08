// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React from 'react';

interface MarkdownAnswerProps {
  content: string;
}

const parseMarkdown = (text: string): React.ReactElement => {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let currentList: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc ml-6 mb-4 space-y-1">
          {currentList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
    if (numberedMatch) {
      flushList();
      elements.push(
        <div key={index} className="mb-2">
          <span className="font-semibold mr-2">{numberedMatch[1]}.</span>
          <span>{numberedMatch[2]}</span>
        </div>
      );
      return;
    }

    // Handle bullet points (* or -)
    const bulletMatch = trimmedLine.match(/^[*-]\s*(.+)$/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
      return;
    }

    flushList();

    if (!trimmedLine) {
      elements.push(<br key={index} />);
      return;
    }

    // Handle bold text (**text**)
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = trimmedLine.split(boldRegex);
    const formattedLine = parts.map((part, partIndex) => {
      if (partIndex % 2 === 1) {
        return <strong key={partIndex} className="font-semibold">{part}</strong>;
      }
      return part;
    });

    elements.push(
      <p key={index} className="mb-3 leading-relaxed">
        {formattedLine}
      </p>
    );
  });

  flushList();
  return <div className="space-y-2">{elements}</div>;
};

export function MarkdownAnswer({ content }: MarkdownAnswerProps) {
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
  const think = thinkMatch ? thinkMatch[1].trim() : null;
  const mainContent = thinkMatch ? content.replace(thinkMatch[0], "") : content;

  return (
    <div className="prose max-w-none">
      {parseMarkdown(mainContent)}
    </div>
  );
}