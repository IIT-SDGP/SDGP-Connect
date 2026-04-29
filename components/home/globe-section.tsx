// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "@/hooks/LanguageProvider";

const ThreeGlobe = dynamic(() => import("@/components/ui/ThreeGlobe"), { ssr: false });

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj,
  );
}


/* ── variants ───────────────────────────────────────────────── */
const ITEM = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const STATIC  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }

export default function GlobeSection() {
  const { t }   = useLanguage();
  const content = getNested(t, ["home", "global_reach"], {});
  const rm      = useReducedMotion() ?? false;
  const item    = rm ? STATIC : ITEM;

  const heading     = content.heading     || "Building connections across continents";
  const description = content.description || "SDGP connects innovative minds from around the world to solve global challenges through technology and collaboration.";

  return (
    <section className="relative w-full text-white overflow-hidden" aria-label="Global reach">
      <div className="mx-auto max-w-[1300px] px-4 md:px-6 py-16 md:py-24 lg:py-32">

        {/* ── Desktop: 2-col — text left, globe right ─────── */}
        <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-[5fr_7fr] lg:gap-12">

          {/* Left: text block — improved spacing */}
          <motion.div
            variants={rm ? {} : STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:pr-8 xl:pr-12 py-8 lg:py-0"
          >
            {/* Eyebrow */}
            <motion.div variants={item} className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 flex-shrink-0 bg-white/15" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
                Global Vision
              </span>
            </motion.div>

            {/* Heading — improved hierarchy */}
            <motion.h2
              variants={item}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-[-0.02em] text-white mb-7"
            >
              {heading}
            </motion.h2>

            {/* Paragraph — better contrast and spacing */}
            <motion.p
              variants={item}
              className="text-[15px] leading-[1.8] text-white/50 max-w-[420px] mb-10"
            >
              {description}
            </motion.p>

            {/* Proof chips — refined styling */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {["Sri Lanka", "Global reach", "SDG-aligned"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/38 transition-all duration-150 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/50"
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: globe — signature visual — improved composition */}
          <motion.div
            initial={rm ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.12 }}
            className="relative h-[360px] sm:h-[480px] lg:h-[600px] w-full"
          >
            {/* Radial fade to blend globe into page background */}
            <div className="pointer-events-none absolute inset-0 z-10 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_55%,transparent_95%)]">
              <div className="absolute inset-0 z-10">
                <ThreeGlobe className="h-full w-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
