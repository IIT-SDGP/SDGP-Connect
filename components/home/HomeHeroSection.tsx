// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MorphingText from "@/components/home/Morphing";
import { HeroDomains } from "@/components/home/HeroDomains";
import { useLanguage } from "@/hooks/LanguageProvider";
import { indicTextClass, isIndicLang } from "@/lib/i18n-utils";
import { cn } from "@/lib/utils";

const Logo = () => (
  <div className="m-0 p-0 leading-none flex justify-center items-center -mb-4 sm:-mb-5 md:-mb-6">
    <div className="relative">
      <Image
        src="/test.svg"
        alt="SDGP Logo"
        className="block h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72"
        width={72}
        height={72}
        priority
      />
    </div>
  </div>
);

function getNested(obj: unknown, path: string[], fallback: any = undefined) {
  return (path as string[]).reduce(
    (acc: any, key: string) =>
      acc && acc[key] !== undefined ? acc[key] : fallback,
    obj
  );
}

const heroImages = [
  "/home/hero/dialog-ino.webp",
  "/home/hero/movemate1.webp",
  "/home/hero/3.webp",
  "/home/hero/1.webp",
  "/home/hero/codesprint.webp",
  "/home/hero/inno.webp",
  "/home/hero/2.webp",
];

export default function HomeHeroSection() {
  const { t, lang } = useLanguage();
  const homeHero = getNested(t, ["home", "hero"], {});
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [currentHeroImage]);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const total = heroImages.length;
  const prevIndex = (currentHeroImage - 1 + total) % total;
  const nextIndex = (currentHeroImage + 1) % total;
  const mountedIndices = new Set([prevIndex, currentHeroImage, nextIndex]);

  const morphingTexts = useMemo(
    () => [
      homeHero.morphing_text1 || "Transforming Ideas Into Brands",
      homeHero.morphing_text2 || "Crafting Digital Experiences",
      homeHero.morphing_text3 || "Building Tomorrow's Solutions",
      homeHero.morphing_text4 || "Creating Innovative Designs",
    ],
    [
      homeHero.morphing_text1,
      homeHero.morphing_text2,
      homeHero.morphing_text3,
      homeHero.morphing_text4,
    ]
  );

  const heroButtonClass = cn(
    "flex-1 sm:flex-none sm:min-w-[10.5rem]",
    "h-14 sm:h-12",
    "inline-flex items-center justify-center",
    "px-2.5 sm:px-8",
    isIndicLang(lang) ? "text-[10px] sm:text-sm" : "text-xs sm:text-base",
    "rounded-full font-semibold",
    "transition-all hover:scale-105",
    "text-center leading-tight",
    "whitespace-normal",
    indicTextClass(lang),
  );

  const heroShrink = 1 - scrollProgress * 0.28;
  const heroZoomOut = 1 - scrollProgress * 0.22;
  const heroCoverScale = (1.15 / heroShrink) * heroZoomOut;
  const heroParallaxY = scrollProgress * 14;

  return (
    <section
      id="home"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-black pt-16 transition-all duration-300 md:min-h-screen md:pt-14"
      style={{ overflowY: scrollProgress > 0 ? "visible" : "hidden" }}
    >
      <div
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{
          transform: `scale(${heroShrink})`,
          borderRadius: `${scrollProgress * 40}px`,
        }}
      >
        {heroImages.map((image, index) => {
          if (!mountedIndices.has(index)) return null;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${index === currentHeroImage ? "opacity-100" : "opacity-0"
                }`}
            >
              <img
                src={image}
                alt="Hero"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="absolute left-1/2 top-1/2 block min-h-full min-w-full origin-center object-cover object-center"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `translate(-50%, calc(-50% + ${heroParallaxY}vh)) scale(${heroCoverScale})`,
                }}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

        <div
          className="absolute bottom-[max(5rem,calc(env(safe-area-inset-bottom,0px)+4.5rem))] left-0 right-0 z-20 h-20 overflow-hidden transition-opacity duration-300 sm:h-24 md:bottom-0"
          style={{ opacity: 1 - scrollProgress * 0.5 }}
        >
          <HeroDomains className="h-full" />
        </div>
      </div>

      <div
        className="relative z-20 w-full min-w-0 px-5 sm:px-8 md:px-[8%] max-w-5xl mx-auto transition-opacity duration-300 flex flex-col items-center text-center"
        style={{
          opacity: 1 - scrollProgress * 0.5,
          transform: `translateY(${scrollProgress * -30}px)`,
        }}
      >
        <div
          className="w-full animate-slideTextUp mt-20 sm:mt-28 md:mt-36 flex flex-col items-center gap-0"
          style={{ animationDelay: "0.1s" }}
        >
          <Logo />
          <MorphingText
            lang={lang}
            texts={morphingTexts}
            className="w-full max-w-5xl mx-auto text-center mt-[-52px] mb-2 text-base sm:text-2xl md:text-3xl text-white font-semibold"
          />
        </div>

        <div
          className="w-full max-w-md sm:max-w-none sm:w-auto flex flex-row items-stretch gap-2 sm:gap-4 animate-slideTextUp justify-center"
          style={{ animationDelay: "0.2s" }}
        >
          <Button
            asChild
            className={cn(heroButtonClass, "bg-white text-black hover:bg-white/90")}
          >
            <Link href="/project">
              {homeHero.explore_button || "Explore projects"}
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              heroButtonClass,
              "bg-white/10 border border-white/35 text-white hover:bg-white/20",
            )}
          >
            <Link href="/about">
              {homeHero.learn_more_button || "Learn more"}
            </Link>
          </Button>
        </div>

        <div
          className="flex gap-2 mt-5 sm:mt-6 mb-20 sm:mb-24 justify-center transition-opacity duration-300 relative z-30"
          style={{ opacity: 1 - scrollProgress }}
        >
          {heroImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentHeroImage(index)}
              aria-label={`Show hero image ${index + 1}`}
              className="h-1 bg-white/15 w-7 sm:w-10 rounded-full overflow-hidden hover:bg-white/25 transition-colors duration-300 cursor-pointer"
            >
              <div
                className={`h-full bg-white transition-all duration-[5000ms] linear ${index === currentHeroImage ? "w-full" : "w-0"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}