// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(texts[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setDisplayText(texts[(currentIndex + 1) % texts.length]);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, texts]);

  return (
    <div className={(className || "") + " w-full"}>
      <div className="relative h-[2.85rem] sm:h-[3.35rem] md:h-[3.85rem] w-full overflow-hidden">
        {texts.map((text, index) => (
          <motion.span
            key={index}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-semibold leading-none"
            initial={{ opacity: 0, y: 14 }}
            animate={
              currentIndex === index
                ? { y: -3, opacity: 1 }
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