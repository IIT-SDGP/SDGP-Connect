// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { isIndicLang } from '@/lib/i18n-utils';

interface MorphingTextProps {
  texts: string[];
  className?: string;
  lang?: string;
}

const MorphingText: React.FC<MorphingTextProps> = ({ texts, className, lang = 'en' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textsKey = useMemo(() => texts.join('\u0000'), [texts]);
  const indic = isIndicLang(lang);

  useEffect(() => {
    setCurrentIndex(0);
  }, [textsKey]);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [textsKey, texts.length]);

  return (
    <div className={cn(className, "w-full min-w-0 max-w-full")}>
      <div
        className={cn(
          "relative w-full max-w-full overflow-hidden px-2",
          indic ? "min-h-[4.5rem] sm:min-h-[4rem]" : "min-h-[2.85rem] sm:min-h-[3.35rem] md:min-h-[3.85rem]"
        )}
      >
        {texts.map((text, index) => (
          <motion.span
            key={`${textsKey}-${index}`}
            lang={lang === 'th' ? 'ta' : lang === 'si' ? 'si' : 'en'}
            className={cn(
              "absolute inset-x-0 inset-y-0 flex items-center justify-center px-1 text-center font-semibold",
              indic
                ? "whitespace-normal text-balance leading-[1.45] sm:leading-[1.35]"
                : "whitespace-nowrap leading-none"
            )}
            initial={{ opacity: 0, y: 14 }}
            animate={
              currentIndex === index
                ? { y: 0, opacity: 1 }
                : { y: currentIndex > index ? -14 : 14, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 50 }}
          >
            {text}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default MorphingText;
