// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "@/hooks/LanguageProvider";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false },
);

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback),
    obj,
  );
}

const globeConfig = {
  pointSize:           4,
  globeColor:          "#062056",
  showAtmosphere:      true,
  atmosphereColor:     "#FFFFFF",
  atmosphereAltitude:  0.1,
  emissive:            "#062056",
  emissiveIntensity:   0.1,
  shininess:           0.9,
  polygonColor:        "rgba(255,255,255,0.7)",
  ambientLight:        "#38bdf8",
  directionalLeftLight:"#ffffff",
  directionalTopLight: "#ffffff",
  pointLight:          "#ffffff",
  arcTime:             1000,
  arcLength:           0.9,
  rings:               1,
  maxRings:            3,
  initialPosition:     { lat: 22.3193, lng: 114.1694 },
  autoRotate:          true,
  autoRotateSpeed:     0.5,
};

const COLORS = ["#06b6d4", "#3b82f6", "#6366f1"];
const sampleArcs = [
  { order:1,  startLat:-19.885592, startLng:-43.951191, endLat:-22.9068,   endLng:-43.1729,    arcAlt:0.1, color:COLORS[0] },
  { order:1,  startLat:28.6139,   startLng:77.209,      endLat:3.139,     endLng:101.6869,    arcAlt:0.2, color:COLORS[1] },
  { order:1,  startLat:-19.885592,startLng:-43.951191,  endLat:-1.303396, endLng:36.852443,   arcAlt:0.5, color:COLORS[2] },
  { order:2,  startLat:1.3521,    startLng:103.8198,    endLat:35.6762,   endLng:139.6503,    arcAlt:0.2, color:COLORS[0] },
  { order:2,  startLat:51.5072,   startLng:-0.1276,     endLat:3.139,     endLng:101.6869,    arcAlt:0.3, color:COLORS[1] },
  { order:2,  startLat:-15.785493,startLng:-47.909029,  endLat:36.162809, endLng:-115.119411, arcAlt:0.3, color:COLORS[2] },
  { order:3,  startLat:-33.8688,  startLng:151.2093,    endLat:22.3193,   endLng:114.1694,    arcAlt:0.3, color:COLORS[0] },
  { order:3,  startLat:21.3099,   startLng:-157.8581,   endLat:40.7128,   endLng:-74.006,     arcAlt:0.3, color:COLORS[1] },
  { order:3,  startLat:-6.2088,   startLng:106.8456,    endLat:51.5072,   endLng:-0.1276,     arcAlt:0.3, color:COLORS[2] },
  { order:4,  startLat:11.986597, startLng:8.571831,    endLat:-15.595412,endLng:-56.05918,   arcAlt:0.5, color:COLORS[0] },
  { order:4,  startLat:-34.6037,  startLng:-58.3816,    endLat:22.3193,   endLng:114.1694,    arcAlt:0.7, color:COLORS[1] },
  { order:4,  startLat:51.5072,   startLng:-0.1276,     endLat:48.8566,   endLng:-2.3522,     arcAlt:0.1, color:COLORS[2] },
  { order:5,  startLat:14.5995,   startLng:120.9842,    endLat:51.5072,   endLng:-0.1276,     arcAlt:0.3, color:COLORS[0] },
  { order:5,  startLat:1.3521,    startLng:103.8198,    endLat:-33.8688,  endLng:151.2093,    arcAlt:0.2, color:COLORS[1] },
  { order:5,  startLat:34.0522,   startLng:-118.2437,   endLat:48.8566,   endLng:-2.3522,     arcAlt:0.2, color:COLORS[2] },
  { order:6,  startLat:-15.432563,startLng:28.315853,   endLat:1.094136,  endLng:-63.34546,   arcAlt:0.7, color:COLORS[0] },
  { order:6,  startLat:37.5665,   startLng:126.978,     endLat:35.6762,   endLng:139.6503,    arcAlt:0.1, color:COLORS[1] },
  { order:6,  startLat:22.3193,   startLng:114.1694,    endLat:51.5072,   endLng:-0.1276,     arcAlt:0.3, color:COLORS[2] },
  { order:7,  startLat:-19.885592,startLng:-43.951191,  endLat:-15.595412,endLng:-56.05918,   arcAlt:0.1, color:COLORS[0] },
  { order:7,  startLat:48.8566,   startLng:-2.3522,     endLat:52.52,     endLng:13.405,      arcAlt:0.1, color:COLORS[1] },
  { order:7,  startLat:52.52,     startLng:13.405,      endLat:34.0522,   endLng:-118.2437,   arcAlt:0.2, color:COLORS[2] },
  { order:8,  startLat:-8.833221, startLng:13.264837,   endLat:-33.936138,endLng:18.436529,   arcAlt:0.2, color:COLORS[0] },
  { order:8,  startLat:49.2827,   startLng:-123.1207,   endLat:52.3676,   endLng:4.9041,      arcAlt:0.2, color:COLORS[1] },
  { order:8,  startLat:1.3521,    startLng:103.8198,    endLat:40.7128,   endLng:-74.006,     arcAlt:0.5, color:COLORS[2] },
  { order:9,  startLat:51.5072,   startLng:-0.1276,     endLat:34.0522,   endLng:-118.2437,   arcAlt:0.2, color:COLORS[0] },
  { order:9,  startLat:22.3193,   startLng:114.1694,    endLat:-22.9068,  endLng:-43.1729,    arcAlt:0.7, color:COLORS[1] },
  { order:9,  startLat:1.3521,    startLng:103.8198,    endLat:-34.6037,  endLng:-58.3816,    arcAlt:0.5, color:COLORS[2] },
  { order:10, startLat:-22.9068,  startLng:-43.1729,    endLat:28.6139,   endLng:77.209,      arcAlt:0.7, color:COLORS[0] },
  { order:10, startLat:34.0522,   startLng:-118.2437,   endLat:31.2304,   endLng:121.4737,    arcAlt:0.3, color:COLORS[1] },
  { order:10, startLat:-6.2088,   startLng:106.8456,    endLat:52.3676,   endLng:4.9041,      arcAlt:0.3, color:COLORS[2] },
  { order:11, startLat:41.9028,   startLng:12.4964,     endLat:34.0522,   endLng:-118.2437,   arcAlt:0.2, color:COLORS[0] },
  { order:11, startLat:-6.2088,   startLng:106.8456,    endLat:31.2304,   endLng:121.4737,    arcAlt:0.2, color:COLORS[1] },
  { order:12, startLat:34.0522,   startLng:-118.2437,   endLat:37.7749,   endLng:-122.4194,   arcAlt:0.1, color:COLORS[0] },
  { order:12, startLat:35.6762,   startLng:139.6503,    endLat:22.3193,   endLng:114.1694,    arcAlt:0.2, color:COLORS[1] },
  { order:13, startLat:52.52,     startLng:13.405,      endLat:22.3193,   endLng:114.1694,    arcAlt:0.3, color:COLORS[0] },
  { order:13, startLat:11.986597, startLng:8.571831,    endLat:35.6762,   endLng:139.6503,    arcAlt:0.3, color:COLORS[1] },
  { order:14, startLat:-33.936138,startLng:18.436529,   endLat:21.395643, endLng:39.883798,   arcAlt:0.3, color:COLORS[2] },
];

/* ── variants ───────────────────────────────────────────────── */
const ITEM = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}
const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const STATIC  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }

export default function GlobeSection() {
  const { t }   = useLanguage();
  const content = getNested(t, ["home", "global_reach"], {});
  const rm      = useReducedMotion() ?? false;
  const item    = rm ? STATIC : ITEM;

  const heading     = content.heading     || "Building connections across continents";
  const description = content.description || "SDGP connects innovative minds from around the world to solve global challenges through technology and collaboration.";

  return (
    <section className="relative w-full text-white overflow-hidden" aria-label="Global reach">
      <div className="mx-auto max-w-[1300px] px-4 md:px-6 py-16 md:py-24 lg:py-32">

        {/* ── Desktop: 2-col — text left, globe right ─────── */}
        <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-[5fr_7fr] lg:gap-12">

          {/* Left: text block — improved spacing */}
          <motion.div
            variants={rm ? {} : STAGGER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:pr-8 xl:pr-12 py-8 lg:py-0"
          >
            {/* Eyebrow */}
            <motion.div variants={item} className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 flex-shrink-0 bg-white/15" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
                Global Vision
              </span>
            </motion.div>

            {/* Heading — improved hierarchy */}
            <motion.h2
              variants={item}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-[-0.02em] text-white mb-7"
            >
              {heading}
            </motion.h2>

            {/* Paragraph — better contrast and spacing */}
            <motion.p
              variants={item}
              className="text-[15px] leading-[1.8] text-white/50 max-w-[420px] mb-10"
            >
              {description}
            </motion.p>

            {/* Proof chips — refined styling */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {["Sri Lanka", "Global reach", "SDG-aligned"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/38 transition-all duration-150 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/50"
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: globe — signature visual — improved composition */}
          <motion.div
            initial={rm ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.12 }}
            className="relative h-[360px] sm:h-[480px] lg:h-[600px] w-full"
          >
            {/* Radial fade to blend globe into page background */}
            <div className="pointer-events-none absolute inset-0 z-10 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_55%,transparent_95%)]">
              <div className="absolute inset-0 z-10">
                <World data={sampleArcs} globeConfig={globeConfig} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
