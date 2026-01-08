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
  const { lang, changeLanguage } = useLanguage();  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 ">
      <div className="relative group bg-blue-500/5 hover:bg-blue-500/0 border border-blue-500/20 text-foreground rounded-l-2xl p-2 flex flex-col items-center gap-2 transition-all duration-200 backdrop-blur-md">
        {/* Neon effect - top gradient */}
        <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent dark:via-blue-500 via-blue-600 to-transparent")} />
        
        {langs.map(l => (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            className={`w-7 h-7 text-xs font-semibold rounded-lg border-none outline-none transition-colors duration-200 cursor-pointer flex items-center justify-center ${
              lang === l.code
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-400 hover:bg-blue-100'
            }`}
          >
            {l.label}
          </button>
        ))}
        
        {/* Neon effect - bottom gradient */}
        <span className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent dark:via-blue-500 via-blue-600 to-transparent")} />
      </div>
    </div>
  );
}
