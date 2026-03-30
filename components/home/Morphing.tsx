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
    <div className={className + " flex flex-col gap-4"}>
      <h1 className="text-2xl md:text-3xl max-w-2xl tracking-tighter text-center font-regular">
      <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
        &nbsp;
        {texts.map((text, index) => (
        <motion.span
          key={index}
          className="absolute font-semibold"
          initial={{ opacity: 0, y: -100 }}
          animate={
          currentIndex === index
            ? { y: 0, opacity: 1 }
            : { y: currentIndex > index ? -100 : 100, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 50 }}
        >
          {text}
        </motion.span>
        ))}
      </span>
      </h1>
    </div>
  );
};

export default MorphingText;