// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Eye } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageProvider";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false }
);

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj
  );
}

const GLOBE_STYLES = `
  @keyframes sdgp-rotate    { to { transform: rotate(360deg); } }
  @keyframes sdgp-rotateCCW { to { transform: rotate(-360deg); } }
  @keyframes sdgp-float     { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes sdgp-pulse     { 0%,100% { opacity:.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
  @keyframes sdgp-badgePing { 0%,100% { box-shadow:0 0 0 0 rgba(59,130,246,.35); } 50% { box-shadow:0 0 0 8px rgba(59,130,246,0); } }
  @keyframes sdgp-shimmer   { 0%,100% { opacity:.5; } 50% { opacity:1; } }
  @keyframes sdgp-fadeUp    { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

  .sdgp-ring-cw  { animation: sdgp-rotate    var(--dur,20s) linear infinite; }
  .sdgp-ring-ccw { animation: sdgp-rotateCCW var(--dur,30s) linear infinite; }
  .sdgp-globe-float { animation: sdgp-float 6s ease-in-out infinite; }

  .sdgp-stat-pill {
    position: absolute;
    background: rgba(6,32,86,.85);
    border: 1px solid rgba(59,130,246,.35);
    border-radius: 12px;
    padding: 10px 16px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 130px;
    animation: sdgp-fadeUp .7s ease both;
  }
  .sdgp-stat-num   { font-size: 22px; font-weight: 700; color: #fff; line-height: 1; }
  .sdgp-stat-label { font-size: 11px; color: #71717a; letter-spacing: .05em; }
  .sdgp-bar        { height: 2px; border-radius: 2px; background: rgba(59,130,246,.15); margin-top: 6px; overflow: hidden; }
  .sdgp-bar-fill   { height: 100%; border-radius: 2px; background: linear-gradient(90deg,#3b82f6,#6366f1); animation: sdgp-shimmer 2.5s ease-in-out infinite; }

  .sdgp-badge-pill {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(42,82,152,.5);
    background: rgba(42,82,152,.25);
    padding: 6px 16px; border-radius: 9999px;
    font-size: 11px; font-weight: 700;
    letter-spacing: .15em; text-transform: uppercase;
    color: #bfdbfe;
    animation: sdgp-badgePing 3s ease-in-out infinite;
  }
  .sdgp-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #60a5fa;
    animation: sdgp-pulse 2s ease-in-out infinite;
  }
  .sdgp-ring-dot {
    position: absolute;
    width: 8px; height: 8px; border-radius: 50%;
    top: -4px; left: calc(50% - 4px);
  }
`;

export default function GlobeSection() {
  const { t } = useLanguage();
  const content = getNested(t, ["home", "global_reach"], {
    badge_label: "Our Vision",
    heading: "Tech for global good",
    description:
      "To become a launchpad for socially-driven tech innovation, where young minds transform global challenges into digital opportunities, building a more sustainable and equitable future through software.",
    projects_value: "120+",
    projects_label: "Projects",
    students_value: "500+",
    students_label: "Students",
    sdgs_value: "12",
    sdgs_label: "SDGs targeted",
  });

  useEffect(() => {
    if (document.getElementById("sdgp-globe-styles")) return;
    const tag = document.createElement("style");
    tag.id = "sdgp-globe-styles";
    tag.textContent = GLOBE_STYLES;
    document.head.appendChild(tag);
  }, []);

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];

  return (
    <section className="w-full text-white">
      {/* ── Header ── */}
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

      {/* ── Globe stage ── */}
      <div className="relative flex items-center justify-center w-full">
        <div
          className="max-w-7xl mx-auto w-full relative flex items-center justify-center px-4"
          style={{ minHeight: 500 }}
        >
          {/* Stat pill — Projects */}
          <div className="sdgp-stat-pill" style={{ left: "14%", top: "28%", animationDelay: ".3s" }}>
            <span className="sdgp-stat-num">{content.projects_value}</span>
            <span className="sdgp-stat-label">{content.projects_label}</span>
            <div className="sdgp-bar"><div className="sdgp-bar-fill" style={{ width: "80%" }} /></div>
          </div>

          {/* Stat pill — Students */}
          <div className="sdgp-stat-pill" style={{ left: "14%", bottom: "28%", animationDelay: ".5s" }}>
            <span className="sdgp-stat-num">{content.students_value}</span>
            <span className="sdgp-stat-label">{content.students_label}</span>
            <div className="sdgp-bar"><div className="sdgp-bar-fill" style={{ width: "90%", animationDelay: ".4s" }} /></div>
          </div>

          {/* Stat pill — SDGs */}
          <div className="sdgp-stat-pill" style={{ right: "14%", top: "50%", transform: "translateY(-50%)", animationDelay: ".7s" }}>
            <span className="sdgp-stat-num">{content.sdgs_value}</span>
            <span className="sdgp-stat-label">{content.sdgs_label}</span>
            <div className="sdgp-bar"><div className="sdgp-bar-fill" style={{ width: "50%", animationDelay: ".6s" }} /></div>
          </div>

          {/* Orbital rings + globe */}
          <div className="relative flex items-center justify-center" style={{ width: 500, height: 500 }}>

            {/* Ring 1 — slow CW */}
            <div
              className="sdgp-ring-cw absolute rounded-full pointer-events-none"
              style={{ width: 380, height: 380, border: "1px solid rgba(99,102,241,.28)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", "--dur": "18s" } as React.CSSProperties}
            >
              <span className="sdgp-ring-dot" style={{ background: "#3b82f6", boxShadow: "0 0 10px 3px rgba(59,130,246,.6)" }} />
              <span className="sdgp-ring-dot" style={{ top: "auto", bottom: -4, background: "#3b82f6", boxShadow: "0 0 10px 3px rgba(59,130,246,.6)" }} />
            </div>

            {/* Ring 2 — medium CCW, dashed */}
            <div
              className="sdgp-ring-ccw absolute rounded-full pointer-events-none"
              style={{ width: 440, height: 440, border: "1px dashed rgba(59,130,246,.18)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", "--dur": "28s" } as React.CSSProperties}
            >
              <span className="sdgp-ring-dot" style={{ background: "#818cf8", boxShadow: "0 0 10px 3px rgba(129,140,248,.6)", left: -4, top: "calc(50% - 4px)" }} />
              <span className="sdgp-ring-dot" style={{ background: "#818cf8", boxShadow: "0 0 10px 3px rgba(129,140,248,.6)", top: "auto", bottom: -4 }} />
            </div>

            {/* Ring 3 — slow CW */}
            <div
              className="sdgp-ring-cw absolute rounded-full pointer-events-none"
              style={{ width: 500, height: 500, border: "1px solid rgba(139,92,246,.12)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", "--dur": "42s" } as React.CSSProperties}
            >
              <span className="sdgp-ring-dot" style={{ background: "#2dd4bf", boxShadow: "0 0 10px 3px rgba(45,212,191,.6)" }} />
            </div>

            {/* Globe — floats */}
            <div className="sdgp-globe-float relative overflow-hidden" style={{ width: 400, height: 400 }}>
              <div className="absolute inset-0 z-10">
                <World data={sampleArcs} globeConfig={globeConfig} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}