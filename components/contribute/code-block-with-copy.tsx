// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockWithCopyProps {
  code: string;
  className?: string;
}

export default function CodeBlockWithCopy({ code, className = "" }: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-md overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-2">
        <code className="text-xs font-mono text-green-400 flex-1 overflow-x-auto whitespace-nowrap">
          {code}
        </code>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
          className="ml-2 h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800 flex-shrink-0"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
}
