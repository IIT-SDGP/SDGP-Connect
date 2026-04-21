// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageProvider";

type Dict = Record<string, unknown>;

function getNested(obj: unknown, path: string[], fallback: Dict): Dict {
  const source = obj as Dict | undefined;
  const value = path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Dict)) {
      return (acc as Dict)[key];
    }
    return undefined;
  }, source);
  if (value && typeof value === "object") return value as Dict;
  return fallback;
}

const PROOF_CHIPS = ["Industry-backed", "SDG-aligned", "Award-winning teams"];

export default function HomeAboutSection() {
  const { t } = useLanguage();
  const homeCta = getNested(t, ["home", "cta"], {});

  const heading =
    (homeCta.heading as string) || "Where student projects become real products";

  const description =
    (homeCta.description as string) ||
    "SDGP is IIT's flagship module — a full academic year where student teams build, pitch, and ship real products under industry mentorship and real constraints.";

  const buttonText = (homeCta.button as string) || "Explore student projects";

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-16 lg:py-28">
      {/* Decorative glow — top left */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-700/15 blur-[120px] pointer-events-none" />
      <div className="mx-auto max-w-[1280px]">

        {/* 12-col bento grid */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">

          {/* ── Left: text block (5 cols) ───────────────────────── */}
          <div className="flex flex-col justify-center lg:col-span-5">

            {/* Eyebrow */}
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300/60">
              The SDGP Experience
            </p>

            {/* Heading — improved hierarchy */}
            <h2 className="mb-6 text-4xl font-bold leading-[1.12] tracking-[-0.02em] text-white lg:text-5xl">
              {heading}
            </h2>

            {/* Paragraph — better breathing room */}
            <p className="mb-10 max-w-[420px] text-[15px] leading-[1.8] text-white/50">
              {description}
            </p>

            {/* CTA — refined styling */}
            <div className="mb-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-gradient-to-b from-[#3b82f6] to-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.45),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 hover:from-[#60a5fa] hover:to-[#3b82f6] hover:shadow-[0_4px_20px_rgba(59,130,246,0.55)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
              >
                {buttonText}
                <ArrowRight className="h-3.5 w-3.5 opacity-60" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Proof chips — improved spacing and styling */}
            <div>
              <div className="mb-5 h-px w-10 bg-white/8" />
              <div className="flex flex-wrap gap-2.5">
                {PROOF_CHIPS.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40 transition-colors duration-150 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/55"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: bento image grid (7 cols) ────────────────── */}
          <div className="flex flex-col gap-4 lg:col-span-7">

            {/* Large feature image — refined borders and overlay */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.01]">
              <Image
                src="/assets/inno.webp"
                alt="SDGP students presenting their project at Innovex"
                width={1200}
                height={680}
                className="h-[280px] w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-[320px]"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {/* Small images — 2 col row with improved spacing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.01]">
                <Image
                  src="/assets/dialog-ino.webp"
                  alt="SDGP industry partner collaboration"
                  width={700}
                  height={440}
                  className="h-[180px] w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-[200px]"
                  sizes="(max-width: 1024px) 50vw, 29vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.01]">
                <Image
                  src="/assets/innovex.webp"
                  alt="SDGP project showcase at Innovex expo"
                  width={700}
                  height={440}
                  className="h-[180px] w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-[200px]"
                  sizes="(max-width: 1024px) 50vw, 29vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
