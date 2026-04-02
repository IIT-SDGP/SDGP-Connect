// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

export function normalizeMarkdownContent(content: string): string {
  // Remove hidden reasoning blocks when present in model output.
  const withoutThinkTags = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  let normalized = withoutThinkTags.replace(/\r\n?/g, "\n");

  // Some responses arrive with escaped newlines instead of real line breaks.
  if (!normalized.includes("\n") && normalized.includes("\\n")) {
    normalized = normalized.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  }

  // Recover headings that may miss the required space after hash characters.
  normalized = normalized.replace(/^(#{1,6})([^\s#])/gm, "$1 $2");

  // Unwrap markdown when the model wraps the whole response in a fenced code block.
  const fencedMarkdown = normalized.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
  if (fencedMarkdown?.[1]) {
    normalized = fencedMarkdown[1].trim();
  }

  // Clean up common dangling emphasis markers like "text*)".
  normalized = normalized
    .replace(/(\S)\*([\),\.;:!?]|$)/g, "$1$2")
    .replace(/(\S)_([\),\.;:!?]|$)/g, "$1$2");

  return normalized;
}
