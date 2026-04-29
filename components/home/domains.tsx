// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Layers3 } from "lucide-react";
import { projectDomainsOptions } from "@/lib/types/mapping";
import { useLanguage } from "@/hooks/LanguageProvider";

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj);
}

/* ── variants ───────────────────────────────────────────────── */
const ITEM = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const STATIC  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }

export default function Domains() {
  const { t }   = useLanguage();
  const domains = getNested(t, ['home', 'domains'], {});
  const rm      = useReducedMotion() ?? false;
  const item    = rm ? STATIC : ITEM;

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 text-white overflow-hidden" aria-label="Project domains">
      {/* Decorative glow — top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">

        {/* Header — improved spacing */}
        <motion.div
          variants={rm ? {} : STAGGER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center text-center mb-14"
        >
          {/* Eyebrow badge — refined styling */}
          <motion.div variants={item} className="mb-6">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/15 bg-blue-500/[0.05] px-3.5 py-2 text-[12px] font-medium text-blue-300/65">
              <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              {domains.badge || "Project domains"}
            </span>
          </motion.div>

          {/* Heading — better hierarchy */}
          <motion.h2
            variants={item}
            className="mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white max-w-2xl"
          >
            {domains.heading || "Explore key Innovation domains"}
          </motion.h2>

          {/* Paragraph — improved contrast */}
          <motion.p
            variants={item}
            className="max-w-[500px] text-[15px] leading-[1.75] text-white/48"
          >
            {domains.description ||
              "Discover a wide range of technology domains driving the future — from AI and Blockchain to Sustainability and Gaming."}
          </motion.p>
        </motion.div>
      </div>

      {/* ── Domains grid ──────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {projectDomainsOptions.map((domain) => (
            <a
              key={domain.value}
              href={"project?domains=" + domain.value}
              target="_blank"
              rel="noopener noreferrer"
              className="group/d relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 aspect-square hover:border-blue-400/40 hover:bg-blue-500/5 transition-all duration-500"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/d:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08), transparent 70%)' }}
              />
              <div className="relative text-white/50 group-hover/d:text-blue-300/80 transition-colors duration-300">
                {domain.icon && React.createElement(domain.icon, { size: 24, strokeWidth: 1.5 })}
              </div>
              <p className="relative text-xs font-medium text-white/50 group-hover/d:text-white/75 text-center transition-colors duration-300">
                {domain.label}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* CTA — improved styling and spacing */}
      <div className="mt-12 flex justify-center px-4">
        <Link
          href="/project"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-6 py-2.5 text-[14px] font-medium text-white/60 transition-all duration-200 hover:border-white/18 hover:bg-white/[0.09] hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          {domains.button || "View projects of all domains"}
          <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
