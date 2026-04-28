// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  coverImage: string | undefined;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ coverImage }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Image drifts slightly slower than the page so the cover feels “stuck” (parallax). */
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "20%"]
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.05]
  );

  return (
    <section ref={sectionRef} className="relative bg-black">
      <div className="relative aspect-video w-full min-h-[min(52vw,280px)] max-h-[78vh] overflow-hidden sm:min-h-[320px] md:min-h-[400px] lg:min-h-[460px] xl:min-h-[520px]">
        <motion.div
          className="absolute -inset-[12%] will-change-transform"
          style={{
            y: imageY,
            scale: imageScale,
          }}
        >
          <Image
            fill
            src={coverImage || "https://placehold.co/1280x720/png?text=NO+IMAGE"}
            alt="Project Cover"
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/45 to-black/35" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_60%_at_50%_0%,rgba(99,102,241,0.28),transparent)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(80%_45%_at_50%_10%,rgba(255,255,255,0.14),transparent)]" />
      </div>
    </section>
  );
};
