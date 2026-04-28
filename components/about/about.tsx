// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";
import { Eye, Target, HeartHandshake } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/hooks/LanguageProvider";

function getNested(obj: Record<string, unknown>, path: string[], fallback: unknown = undefined) {
  return path.reduce(
    (acc, key) =>
      acc && typeof acc === "object" && (acc as Record<string, unknown>)[key] !== undefined
        ? (acc as Record<string, unknown>)[key]
        : fallback,
    obj as unknown
  );
}

export function AboutSection() {
  const { t } = useLanguage();
  const about = (getNested(t as Record<string, unknown>, ["home", "about"], {}) ||
    {}) as Record<string, unknown>;
  const vision = (about.vision_card || {}) as Record<string, string>;
  const values = (about.values_card || {}) as Record<string, string>;
  const mission = (about.mission_card || {}) as Record<string, string>;

  const cards = [
    {
      icon: Eye,
      chip: vision.title || "Our Vision",
      title: vision.sub_title || "Tech for global good",
      body:
        vision.description ||
        "To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software.",
      accent: "from-sky-500/10 to-transparent dark:from-sky-400/15",
    },
    {
      icon: HeartHandshake,
      chip: values.title || "Our Core Values",
      title: values.sub_title || "Driven by purpose",
      body:
        values.description ||
        "We believe in innovation, collaboration, and meaningful impact. Our community thrives on solving real-world problems, learning continuously, and developing technology that serves humanity and the planet.",
      accent: "from-violet-500/10 to-transparent dark:from-violet-400/15",
    },
    {
      icon: Target,
      chip: mission.title || "Our Mission",
      title: mission.sub_title || "Empowering Innovators",
      body:
        mission.description ||
        "To empower the next generation of socially-conscious developers by offering hands-on experience in building impactful full-stack applications that address real-world challenges aligned with the UN SDGs.",
      accent: "from-emerald-500/10 to-transparent dark:from-emerald-400/15",
    },
  ];

  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-br from-muted/80 to-muted/30 p-4 shadow-lg backdrop-blur-sm">
            <Image src="/assets/logo.webp" alt="" width={56} height={56} className="object-contain" />
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {String(about.heading || "Crafting code for a sustainable tomorrow")}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            {String(
              about.description ||
                "Build impactful tech solutions through teamwork, innovation, and purpose driven by SDGP and the UN SDGs."
            )}
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cards.map((card, idx) => (
            <article
              key={card.chip}
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-7 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-card/30 ${
                idx === 1 ? "lg:-mt-2 lg:mb-2 lg:border-primary/25 lg:shadow-lg lg:shadow-primary/5" : ""
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${card.accent}`}
                aria-hidden
              />
              <div className="relative flex flex-col flex-grow">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-inner">
                    <card.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                    {card.chip}
                  </span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{card.title}</h3>
                <p className="mt-4 flex-grow text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-relaxed">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
