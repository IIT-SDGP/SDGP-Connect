// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from 'react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = "" }) => {
  // Simple markdown-to-HTML converter
  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*)/gm, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*)/gm, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
      .replace(/^# (.*)/gm, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto my-2"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
      
      // Images (must come before links to avoid conflicts)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>')
        
      // Lists
      .replace(/^- (.*)/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc mb-2">$1</ul>')
      
      // Line breaks
      .replace(/\n/g, '<br/>');
  };

  const htmlContent = convertMarkdownToHtml(content);

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownPreview;
