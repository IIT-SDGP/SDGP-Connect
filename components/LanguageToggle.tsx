// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { useLanguage } from '../hooks/LanguageProvider';
import { cn } from '@/lib/utils';

const langs = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සිං' },
  { code: 'th', label: 'த' },
];

export default function LanguageToggle() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      <div className="relative group bg-black/40 hover:bg-black/60 border border-white/20 hover:border-blue-500/40 text-foreground rounded-l-2xl p-2 flex flex-col items-center gap-2 transition-all duration-200 backdrop-blur-md">
        {/* Neon effect - top */}
        <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-400 to-transparent")} />

        {langs.map(l => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            title={l.code.toUpperCase()}
            className={cn(
              "w-8 h-8 text-xs font-bold rounded-lg border outline-none transition-all duration-200 cursor-pointer flex items-center justify-center",
              lang === l.code
                ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                : "bg-white/10 text-white/80 border-white/15 hover:bg-blue-500/20 hover:text-white hover:border-blue-400/40"
            )}
          >
            {l.label}
          </button>
        ))}

        {/* Neon effect - bottom */}
        <span className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-400 to-transparent")} />
      </div>
    </div>
  );
}