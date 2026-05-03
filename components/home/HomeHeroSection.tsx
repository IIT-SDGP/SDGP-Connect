"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HomeNavbar from "@/components/HomeNavbar";
import MorphingText from "@/components/home/Morphing";
import { HeroDomains } from "@/components/home/HeroDomains";
import { useLanguage } from "@/hooks/LanguageProvider";

const Logo = () => (
  <div className="m-0 p-0 leading-none flex justify-center items-center -mb-3 sm:-mb-4 md:-mb-5">
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
    (acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj
  );
}

export default function HomeHeroSection() {
  const { t } = useLanguage();
  const homeHero = getNested(t, ["home", "hero"], {});
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const heroImages = [
    "/home/hero/1.jpg",
    "/home/hero/5.jpg",
    "/home/hero/6.jpg",
  ];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [currentHeroImage, heroImages.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / (windowHeight * 0.8), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-svh md:min-h-screen flex items-center bg-black transition-all duration-300 pt-24 md:pt-20 overflow-x-hidden"
      style={{
        overflowY: scrollProgress > 0 ? "visible" : "hidden",
      }}
    >
      <HomeNavbar />

      <div
        className="absolute inset-0 transition-all duration-300 ease-out will-change-transform overflow-hidden"
        style={{
          transform: `scale(${1 - scrollProgress * 0.15})`,
          borderRadius: `${scrollProgress * 40}px`,
          margin: `${scrollProgress * 20}px`,
        }}
      >
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${
              index === currentHeroImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt="Hero"
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60" />

        <div
          className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 z-20 transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: 1 - scrollProgress * 0.5,
          }}
        >
          <HeroDomains className="h-full" />
        </div>
      </div>

      <div
        className="relative z-20 w-full px-5 sm:px-8 md:px-[8%] max-w-5xl mx-auto left-0 right-0 transition-opacity duration-300 flex flex-col items-center text-center"
        style={{
          opacity: 1 - scrollProgress * 0.5,
          transform: `translateY(${scrollProgress * -30}px)`,
        }}
      >
        <div
          className="w-full animate-slideTextUp mt-32 sm:mt-40 md:mt-48 flex flex-col items-center gap-0"
          style={{ animationDelay: "0.1s" }}
        >
          <Logo />
          <MorphingText
            texts={[
              homeHero.morphing_text1 || "Transforming Ideas Into Brands",
              homeHero.morphing_text2 || "Crafting Digital Experiences",
              homeHero.morphing_text3 || "Building Tomorrow's Solutions",
              homeHero.morphing_text4 || "Creating Innovative Designs",
            ]}
            className="w-full max-w-5xl mx-auto text-center mt-[-48px] mb-4 text-xl sm:text-2xl md:text-3xl text-white font-semibold"
          />

        </div>

        <div
          className="w-full max-w-md sm:max-w-none sm:w-auto flex flex-row gap-2 sm:gap-4 animate-slideTextUp justify-center mt-[2px]"
          style={{ animationDelay: "0.2s" }}
        >
          <Button
            asChild
            className="flex-1 sm:flex-none min-w-0 bg-white px-3 sm:px-8 py-3.5 sm:py-6 text-sm sm:text-base rounded-full transition-all hover:scale-105 font-semibold text-black hover:bg-white/90"
          >
            <Link href="/project">Explore projects</Link>
          </Button>
          <Button
            asChild
            className="flex-1 sm:flex-none min-w-0 bg-white/10 border border-white/35 px-3 sm:px-8 py-3.5 sm:py-6 text-sm sm:text-base rounded-full transition-all hover:scale-105 font-semibold text-white hover:bg-white/20"
          >
            <Link href="/about">Learn more</Link>
          </Button>
        </div>

        <div
          className="flex gap-2 mt-6 sm:mt-8 justify-center transition-opacity duration-300"
          style={{
            opacity: 1 - scrollProgress,
          }}
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
                className={`h-full bg-white transition-all duration-[5000ms] linear ${
                  index === currentHeroImage ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}// Barrel file for home components
