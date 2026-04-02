// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { normalizeMarkdownContent } from '@/components/ai/markdown-utils';

interface MarkdownAnswerProps {
  content: string;
}

export function MarkdownAnswer({ content }: MarkdownAnswerProps) {
  const mainContent = normalizeMarkdownContent(content);

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mb-2 mt-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-semibold mb-2 mt-3" {...props} />,
          h4: ({ ...props }) => <h4 className="text-base font-semibold mb-2 mt-2" {...props} />,

          // Paragraphs
          p: ({ ...props }) => <p className="mb-3 leading-relaxed" {...props} />,

          // Lists
          ul: ({ ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
          li: ({ ...props }) => <li className="leading-relaxed" {...props} />,

          // Emphasis
          strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ ...props }) => <em className="italic" {...props} />,

          // Code
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props}>
                {children}
              </code>
            );
          },

          // Links
          a: ({ ...props }) => (
            <a
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Blockquotes
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-muted pl-4 italic my-4" {...props} />
          ),

          // Horizontal rule
          hr: ({ ...props }) => <hr className="my-4 border-muted" {...props} />,
        }}
      >
        {mainContent}
      </ReactMarkdown>
    </div>
  );
}