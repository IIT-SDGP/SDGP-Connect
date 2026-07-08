// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

/** Sinhala and Tamil need different typography than Latin UI copy. */
export function isIndicLang(lang: string) {
  return lang === 'si' || lang === 'th';
}

export function indicTextClass(lang: string) {
  return isIndicLang(lang)
    ? 'break-words leading-relaxed [word-break:break-word] [overflow-wrap:anywhere]'
    : '';
}

export function badgeLabelClass(lang: string) {
  return isIndicLang(lang)
    ? 'normal-case tracking-normal text-[11px] sm:text-xs leading-snug'
    : 'uppercase tracking-[0.15em]';
}
