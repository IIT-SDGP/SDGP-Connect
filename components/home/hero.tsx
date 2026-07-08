// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Carousel from "./carousel";
import MorphingText from "./Morphing";
import { useLanguage } from "@/hooks/LanguageProvider";
import dynamic from "next/dynamic";
import { Banner3 } from "@/components/blog/Banner";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false, loading: () => <div className="min-h-[40px]" /> }
);

const ThreeScene = dynamic(() => import("./three-scene"), {
  ssr: false,
  loading: () => <div className="min-h-[280px] w-full bg-muted/30" />,
});

function getNested(obj: Record<string, unknown>, path: string[], fallback: unknown = undefined) {
  return path.reduce(
    (acc, key) =>
      acc && typeof acc === "object" && (acc as Record<string, unknown>)[key] !== undefined
        ? (acc as Record<string, unknown>)[key]
        : fallback,
    obj as unknown
  );
}

function HeroBadge({ text }: { text: string }) {
  const parts = text
    .split(/\s*[·•|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) {
    return (
      <p className="mb-2 text-center text-xs font-medium leading-none tracking-wide text-muted-foreground sm:mb-2.5">
        {text}
      </p>
    );
  }
  return (
    <div
      className="mb-2 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:mb-2.5 sm:gap-x-1.5"
      role="group"
      aria-label={text}
    >
      {parts.map((part, i) => (
        <span key={`${part}-${i}`} className="inline-flex items-center">
          {i > 0 ? (
            <span
              className="mx-1.5 inline-block h-px w-6 bg-gradient-to-r from-transparent via-primary/45 to-transparent sm:w-8 sm:via-primary/55"
              aria-hidden
            />
          ) : null}
          <span className="relative rounded-full border border-primary/20 bg-gradient-to-b from-background/80 to-muted/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/90 shadow-sm shadow-primary/5 backdrop-blur-sm sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.22em] dark:border-primary/25 dark:from-background/50 dark:to-muted/25 dark:text-foreground">
            <span className="absolute inset-x-3 -top-px h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-80 dark:via-primary/45" aria-hidden />
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const homeHero = (getNested(t as Record<string, unknown>, ["home", "hero"], {}) ||
    {}) as Record<string, string>;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="relative z-20 flex shrink-0 justify-center px-3 pb-1 pt-2 sm:px-4">
        <Banner3
          badgeText="New"
          message="Introducing blogs from your fellow IITians — explore now!"
          linkText="Blogs"
          linkHref="/blog"
        />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-start pt-6 md:pt-10">
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Single soft scrim — content readable, stars still visible above */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/25 via-background/70 to-background dark:from-background/40 dark:via-background/75 dark:to-background"
          aria-hidden
        />

        <MotionDiv
          className="relative z-10 flex w-full max-w-4xl flex-col items-center px-3 pb-14 pt-0 text-center sm:max-w-5xl md:max-w-6xl md:pb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="sr-only">SDGP Connect</h1>
          <HeroBadge text={homeHero.badge || "Innovative · Creative · Impactful"} />

          <MotionDiv
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="my-1 sm:my-1.5 md:my-2"
          >
            <Image
              src="/test.svg"
              alt="SDGP Connect"
              width={1500}
              height={720}
              priority
              className="mx-auto block h-20 w-auto max-w-[min(95vw,60rem)] leading-none sm:h-28 md:h-36 lg:h-44"
            />
          </MotionDiv>

          <div className="mt-2 w-full max-w-xl text-muted-foreground sm:mt-2.5">
            <MorphingText
              texts={[
                homeHero.morphing_text1 || "Transforming Ideas Into Brands",
                homeHero.morphing_text2 || "Crafting Digital Experiences",
                homeHero.morphing_text3 || "Building Tomorrow's Solutions",
                homeHero.morphing_text4 || "Creating Innovative Designs",
              ]}
              className="[&_p]:!text-xl [&_p]:!font-normal [&_p]:!text-muted-foreground md:[&_p]:!text-2xl"
            />
          </div>

          <div className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-md px-6">
              <Link href="/project">{homeHero.explore_button || "Explore projects"}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md px-6">
              <Link href="/about">{homeHero.learn_more_button || "About Us"}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-md px-6">
              <a href="https://www.iit.ac.lk/" target="_blank" rel="noopener noreferrer">
                {homeHero.campus_button || "Visit IIT"}
              </a>
            </Button>
          </div>

          <div className="mt-12 w-full max-w-[min(100vw-0.75rem,85rem)] sm:mt-14">
            <Carousel embedded />
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
