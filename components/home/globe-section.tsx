// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import dynamic from "next/dynamic";
import { Eye } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageProvider";
import { useEffect, useRef, useState } from "react";

const Globe = dynamic(
  () => import("@/components/ui/globe").then((m) => m.Globe),
  { ssr: false }
);

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj
  );
}

const ORBIT_IMAGES = [
  "/home/competition/IMG1.jpeg",
  "/home/competition/IMG2.jpeg",
  "/home/competition/IMG3.png",
  "/home/competition/IMG4.jpeg",
  "/home/competition/IMG5.jpeg",
  "/home/competition/IMG6.jpeg",
];

const GLOBE_STYLES = `
  @keyframes sdgp-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  @keyframes sdgp-pulse {
    0%, 100% { opacity: .4; transform: scale(1); }
    50%       { opacity: 1;  transform: scale(1.15); }
  }

  @keyframes sdgp-badgePing {
    0%, 100% { box-shadow: 0 0 0 0   rgba(59,130,246,.35); }
    50%       { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
  }

  @keyframes sdgp-orbit {
    from { transform: rotate(var(--orbit-start)) translateX(var(--orbit-radius)) rotate(calc(-1 * var(--orbit-start))); }
    to   { transform: rotate(calc(var(--orbit-start) + 360deg)) translateX(var(--orbit-radius)) rotate(calc(-1 * (var(--orbit-start) + 360deg))); }
  }

  @keyframes sdgp-orbitReverse {
    from { transform: rotate(var(--orbit-start)) translateX(var(--orbit-radius)) rotate(calc(-1 * var(--orbit-start))); }
    to   { transform: rotate(calc(var(--orbit-start) - 360deg)) translateX(var(--orbit-radius)) rotate(calc(-1 * (var(--orbit-start) - 360deg))); }
  }

  @keyframes sdgp-fadeIn {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }

  .sdgp-globe-float {
    animation: sdgp-float 6s ease-in-out infinite;
  }

  .sdgp-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(42,82,152,.5);
    background: rgba(42,82,152,.25);
    padding: 6px 16px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: #bfdbfe;
    animation: sdgp-badgePing 3s ease-in-out infinite;
  }

  .sdgp-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #60a5fa;
    animation: sdgp-pulse 2s ease-in-out infinite;
  }

  .sdgp-orbit-wrapper {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .sdgp-orbit-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    pointer-events: auto;
  }

  .sdgp-orbit-item.sdgp-orbit-cw {
    animation: sdgp-orbit var(--orbit-duration) linear infinite;
  }

  .sdgp-orbit-item.sdgp-orbit-ccw {
    animation: sdgp-orbitReverse var(--orbit-duration) linear infinite;
  }

  .sdgp-orbit-avatar {
    position: absolute;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(99,102,241,0.85);
    box-shadow: 0 0 0 2px rgba(59,130,246,0.25), 0 0 18px rgba(59,130,246,0.55);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    background: #0f172a;
    opacity: 0;
  }

  .sdgp-orbit-avatar.sdgp-orbit-avatar--visible {
    animation: sdgp-fadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
    opacity: 1;
  }

  .sdgp-orbit-avatar:hover {
    border-color: rgba(139,92,246,1);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.35), 0 0 28px rgba(99,102,241,0.75);
  }

  .sdgp-orbit-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ORBIT_CONFIG = [
  { radius: "155px", size: 76, duration: "18s",  start: "0deg",    dir: "cw"  },
  { radius: "155px", size: 76, duration: "18s",  start: "120deg",  dir: "cw"  },
  { radius: "155px", size: 76, duration: "18s",  start: "240deg",  dir: "cw"  },
  { radius: "210px", size: 88, duration: "28s",  start: "60deg",   dir: "ccw" },
  { radius: "210px", size: 88, duration: "28s",  start: "180deg",  dir: "ccw" },
  { radius: "210px", size: 88, duration: "28s",  start: "300deg",  dir: "ccw" },
];

function OrbitImages({ visible }: { visible: boolean }) {
  return (
    <div className="sdgp-orbit-wrapper">
      {ORBIT_IMAGES.map((src, i) => {
        const cfg = ORBIT_CONFIG[i];
        const offset = cfg.size / 2;
        return (
          <div
            key={i}
            className={`sdgp-orbit-item sdgp-orbit-${cfg.dir}`}
            style={{
              "--orbit-radius": cfg.radius,
              "--orbit-start": cfg.start,
              "--orbit-duration": cfg.duration,
            } as React.CSSProperties}
          >
            <div
              className={`sdgp-orbit-avatar${visible ? " sdgp-orbit-avatar--visible" : ""}`}
              style={{
                width: cfg.size,
                height: cfg.size,
                top: -offset,
                left: -offset,
                animationDelay: `${i * 0.12}s`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function GlobeSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = getNested(t, ["home", "global_reach"], {
    badge_label: "Our Vision",
    heading: "Tech for global good",
    description:
      "To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software.",
  });

  return (
    <section ref={sectionRef} className="w-full text-white">
      <style>{GLOBE_STYLES}</style>

      <div className="w-full py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-4">

            <span className="sdgp-badge-pill">
              <span className="sdgp-badge-dot" />
              <Eye className="h-3.5 w-3.5" />
              {content.badge_label}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-4xl mx-auto">
              {content.heading}
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto mt-4">
              {content.description}
            </p>

          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full pb-10">
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{ width: "min(560px, 80vw)", height: "min(560px, 80vw)" }}
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
              filter: "blur(40px)",
              transform: "scale(1.2)",
            }}
          />

          <div
            className="sdgp-globe-float relative overflow-hidden"
            style={{ width: "min(480px, 60vw)", height: "min(480px, 60vw)" }}
          >
            <Globe className="w-full h-full" />
          </div>

          <OrbitImages visible={cardsVisible} />
        </div>
      </div>
    </section>
  );
}