// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { useLanguage } from '../hooks/LanguageProvider';
import { useHomeScrollChromeVisible } from '@/hooks/HomeScrollChromeContext';
import { cn } from '@/lib/utils';

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සිං' },
  { code: 'th', label: 'த' },
];

export default function LanguageToggle() {
  const { lang, changeLanguage } = useLanguage();
  const chromeVisible = useHomeScrollChromeVisible();

  return (
    <div
      className={cn(
        'fixed z-[90] top-1/2 -translate-y-1/2 pointer-events-none',
        'right-[max(0px,env(safe-area-inset-right,0px))]',
        'max-md:transition-transform duration-300 ease-out',
        chromeVisible ? 'max-md:translate-x-0' : 'max-md:translate-x-full'
      )}
    >
      <div
        className={cn(
          'relative group bg-black/40 hover:bg-black/60 border border-white/20 hover:border-blue-500/40 text-foreground rounded-l-2xl p-2 flex flex-col items-center gap-2 transition-[background-color,border-color] duration-200 backdrop-blur-md',
          chromeVisible ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-400 to-transparent")} />

        {langs.map(l => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            title={l.code.toUpperCase()}
            className={cn(
              "w-8 h-8 shrink-0 text-xs font-bold rounded-lg border transition-[background-color,border-color,color,box-shadow] duration-200 cursor-pointer flex items-center justify-center leading-none",
              l.code === 'si' && "font-[family-name:var(--font-noto-sans-sinhala)] text-[11px]",
              l.code === 'th' && "font-[family-name:var(--font-noto-sans-tamil)] text-[15px] pb-px",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
              lang === l.code
                ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                : "bg-white/10 text-white/80 border-white/15 hover:bg-blue-500/20 hover:text-white hover:border-blue-400/40"
            )}
          >
            {l.label}
          </button>
        ))}

        <span className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-400 to-transparent")} />
      </div>
    </div>
  );
}
