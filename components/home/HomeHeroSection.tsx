// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import MorphingText from "@/components/home/Morphing";
import { HeroDomains } from "@/components/home/HeroDomains";
import { useLanguage } from "@/hooks/LanguageProvider";

const Logo = () => (
  <div className="flex justify-center items-center">
    <Image
      src="/test.svg"
      alt="SDGP Logo"
      className="h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72 block"
      width={288}
      height={288}
      priority
    />
  </div>
);

function getNested(obj: unknown, path: string[], fallback: any = undefined) {
  return (path as string[]).reduce(
    (acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj,
  );
}

/* ── stagger variants ─────────────────────────────────────── */
const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
}
const ITEM_UP = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}
const STATIC = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
}

export default function HomeHeroSection() {
  const { t }            = useLanguage();
  const homeHero         = getNested(t, ["home", "hero"], {});
  const rm               = useReducedMotion() ?? false;
  const item             = rm ? STATIC : ITEM_UP;
  const stagger          = rm ? {} : { transition: { staggerChildren: 0.11, delayChildren: 0.1 } };

  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [scrollProgress,   setScrollProgress]   = useState(0);
  const [mouse,            setMouse]            = useState({ x: 0, y: 0 });

  const heroImages = ["/home/hero/1.jpg", "/home/hero/5.jpg", "/home/hero/6.jpg"];

  useEffect(() => {
    const t = window.setTimeout(
      () => setCurrentHeroImage((p) => (p + 1) % heroImages.length),
      5000,
    );
    return () => window.clearTimeout(t);
  }, [currentHeroImage, heroImages.length]);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-svh md:min-h-screen flex items-center bg-black overflow-x-hidden"
    >
      <HomeNavbar />

      {/* ── Background image stack ─────────────────────────── */}
      <div
        className="absolute inset-0 overflow-hidden transition-[transform,border-radius,margin] duration-300 ease-out will-change-transform"
        style={{
          transform:    `scale(${1 - scrollProgress * 0.12})`,
          borderRadius: `${scrollProgress * 36}px`,
          margin:       `${scrollProgress * 16}px`,
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
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Star field */}
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{
          backgroundImage: [
            'radial-gradient(1px 1px at 20% 30%, white, transparent)',
            'radial-gradient(1px 1px at 80% 10%, white, transparent)',
            'radial-gradient(1.5px 1.5px at 50% 60%, white, transparent)',
            'radial-gradient(1px 1px at 10% 80%, white, transparent)',
            'radial-gradient(1px 1px at 90% 75%, white, transparent)',
            'radial-gradient(1px 1px at 35% 15%, white, transparent)',
            'radial-gradient(1px 1px at 65% 45%, white, transparent)',
            'radial-gradient(1px 1px at 45% 90%, white, transparent)',
          ].join(', '),
        }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Aurora glow — mouse parallax */}
        <div className="absolute pointer-events-none rounded-full blur-[120px] opacity-50" style={{
          background: 'radial-gradient(ellipse, #1d4ed8 0%, #0c1329 40%, transparent 70%)',
          width: '90vw', height: '70vh',
          top: '33%', left: '50%',
          transform: `translate(calc(-50% + ${mouse.x * 30}px), calc(-50% + ${mouse.y * 30}px))`,
          transition: 'transform 0.4s ease-out',
        }} />

        {/* Gradient overlays — refined blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/96 via-black/75 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-black/60" />

        {/* Domain ticker — subtle fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 z-20 overflow-hidden transition-opacity duration-300"
          style={{ opacity: 1 - scrollProgress * 0.5 }}
        >
          <HeroDomains className="h-full" />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div
        className="relative z-20 w-full flex flex-col items-center text-center px-5 sm:px-8 md:px-[8%] max-w-5xl mx-auto pt-28 sm:pt-36 md:pt-44 pb-32 sm:pb-40"
        style={{
          opacity:   1 - scrollProgress * 0.55,
          transform: `translateY(${scrollProgress * -28}px)`,
        }}
      >
        <motion.div
          variants={{ hidden: {}, visible: stagger }}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-0 w-full"
        >
          {/* IIT badge */}
          <motion.div variants={item} className="mb-6 -mt-4">
            <a
              href="/about"
              className="group inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)' }}
            >
              <img src="/assets/logo.webp" alt="IIT" className="h-5 w-5 object-contain opacity-85 flex-shrink-0" />
              <span className="h-3.5 w-px bg-white/[0.12] flex-shrink-0" />
              <span className="text-[12.5px] font-medium text-white/55 group-hover:text-white/80 transition-colors duration-200 tracking-wide">
                Software Development Group Project
              </span>
              <span className="h-3.5 w-px bg-white/[0.12] flex-shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.12em] text-blue-400/80 uppercase">IIT</span>
            </a>
          </motion.div>

          {/* Logo */}
          <motion.div variants={item} className="-mb-3 sm:-mb-5">
            <Logo />
          </motion.div>

          {/* Morphing subheadline — improved spacing */}
          <motion.div variants={item} className="w-full max-w-4xl">
            <MorphingText
              texts={[
                homeHero.morphing_text1 || "Transforming Ideas Into Brands",
                homeHero.morphing_text2 || "Crafting Digital Experiences",
                homeHero.morphing_text3 || "Building Tomorrow's Solutions",
                homeHero.morphing_text4 || "Creating Innovative Designs",
              ]}
              className="w-full text-xl sm:text-2xl md:text-3xl text-white font-semibold text-center mt-[-36px] mb-10"
            />
          </motion.div>

          {/* CTAs — better spacing and grouping */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center mb-12"
          >
            <Link
              href="/project"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-400/30 bg-gradient-to-b from-[#3b82f6] to-[#2563eb] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-[15px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.45),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 hover:from-[#60a5fa] hover:to-[#3b82f6] hover:shadow-[0_4px_20px_rgba(59,130,246,0.55)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
            >
              Explore projects
              <ArrowRight className="h-3.5 w-3.5 opacity-60" strokeWidth={2.5} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/[0.10] hover:border-white/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
            >
              Learn more
            </Link>
          </motion.div>

          {/* Progress indicators — refined styling */}
          <motion.div
            variants={item}
            className="flex gap-2.5 justify-center"
            style={{ opacity: 1 - scrollProgress * 1.5 }}
          >
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentHeroImage(index)}
                aria-label={`Show hero image ${index + 1}`}
                className="h-[2.5px] bg-white/12 w-6 sm:w-9 rounded-full overflow-hidden hover:bg-white/22 transition-colors duration-200 cursor-pointer"
              >
                <div
                  className={`h-full bg-white transition-all duration-[5000ms] linear ${
                    index === currentHeroImage ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
