// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/LanguageProvider";
import HomeTopNavbar from "@/components/home/home-top-navbar";

type HeroCopy = Record<string, string>;

const spotlightCards = [
  { id: "01", title: "AI for Good", image: "/assets/1.webp" },
  { id: "02", title: "Green Mobility", image: "/assets/2.webp" },
  { id: "03", title: "Fintech Safety", image: "/assets/4.webp" },
  { id: "04", title: "Health Access", image: "/assets/inno.webp" },
];

const Logo = () => (
  <div className="relative w-[180px] sm:w-[250px] md:w-[320px] lg:w-[380px]">
    <Image
      src="/test.svg"
      alt="SDGP Logo"
      width={1500}
      height={720}
      priority
      className="h-auto w-full"
      sizes="(max-width: 640px) 180px, (max-width: 768px) 250px, (max-width: 1024px) 320px, 380px"
    />
  </div>
);

function getNested(obj: unknown, path: string[], fallback: HeroCopy): HeroCopy {
  const source = obj as Record<string, unknown> | undefined;
  const value = path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);

  if (value && typeof value === "object") {
    return value as HeroCopy;
  }

  return fallback;
}

export default function HeroNetflix() {
  const { t } = useLanguage();
  const homeHero = getNested(t, ["home", "hero"], {});
  const carouselCards = [...spotlightCards, ...spotlightCards, ...spotlightCards];

  const description =
    homeHero.hero_description ||
    "Discover standout student products, startup-ready concepts, and meaningful solutions shaped inside SDGP.";

  return (
    <section className="relative min-h-[96vh] w-full overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0">
        <Image
          src="/home/hero/1.jpg"
          alt="Featured SDGP project backdrop"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60" />
      </div>

      <div className="relative z-10 flex min-h-[96vh] w-full flex-col pb-10 pt-2 sm:pt-3">
        <HomeTopNavbar />

        <div className="flex flex-1 flex-col justify-center px-2 sm:px-8 md:px-12 lg:max-w-2xl lg:px-16">
          <span className="mb-[6px] inline-flex w-fit items-center rounded-full border border-[#2a5298]/30 bg-[#2a5298]/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            {homeHero.badge || "Innovative • Creative • Impactful"}
          </span>

          <div className="-ml-1 sm:-ml-2">
            <Logo />
          </div>

          <p className="mt-[6px] max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
            {description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild className="h-11 rounded-md bg-white px-6 text-sm font-semibold text-black hover:bg-white/90">
              <Link href="/project">{homeHero.explore_button || "Explore projects"}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="h-11 rounded-md border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20"
            >
              <Link href="/about">{homeHero.learn_more_button || "Learn more"}</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 px-2 sm:px-8 md:px-12 lg:px-16">
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#050505] to-transparent sm:w-16" />
            <motion.div
              className="flex gap-3"
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            >
              {carouselCards.map((card, index) => (
                <article
                  key={`${card.id}-${index}`}
                  className="group relative w-[calc(50%-0.375rem)] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/60 shadow-[0_10px_40px_rgba(0,0,0,0.45)] sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(20%-0.6rem)]"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
