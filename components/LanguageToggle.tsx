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
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col items-center gap-1 rounded-xl border border-white/8 bg-[rgba(8,8,10,0.80)] p-2 backdrop-blur-lg shadow-lg shadow-black/40">
        {langs.map((l) => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            aria-label={`Switch to ${l.code === 'en' ? 'English' : l.code === 'si' ? 'Sinhala' : 'Tamil'}`}
            aria-pressed={lang === l.code}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/25',
              lang === l.code
                ? 'bg-gradient-to-b from-[#2a5298] to-[#1c3872] text-white shadow-md shadow-blue-900/40 border border-[#253d82]'
                : 'bg-transparent text-white/40 hover:bg-white/[0.08] hover:text-white/65 border border-transparent transition-colors',
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
