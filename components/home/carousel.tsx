// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "/assets/Dialog.webp",
  "/assets/1.webp",
  "/assets/inno.webp",
  "/assets/2.webp",
  "/assets/Codesprint.webp",
  "/assets/4.webp",
  "/assets/3.webp",
  "/assets/innovex.webp",
  "/assets/movemate1.webp",
  "/assets/win.webp",
  "/assets/3.webp",
  "/assets/dialog-ino.webp",
];

type CarouselProps = {
  /** Strip only — classic hero embed (no section heading). */
  embedded?: boolean;
};

export default function Carousel({ embedded = false }: CarouselProps) {
  const duplicatedImages = [...images, ...images];

  const track = (
    <div
      className={
        embedded
          ? "relative w-full overflow-hidden py-2 sm:py-3"
          : "relative -mx-1 overflow-hidden rounded-3xl border border-border/60 bg-muted/20 py-6 shadow-inner backdrop-blur-sm dark:bg-muted/10"
      }
    >
      <div
        className={
          embedded
            ? "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16"
            : "pointer-events-none absolute inset-y-4 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/90 to-transparent sm:w-28"
        }
      />
      <div
        className={
          embedded
            ? "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16"
            : "pointer-events-none absolute inset-y-4 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/90 to-transparent sm:w-28"
        }
      />

      <motion.div
        className={embedded ? "flex gap-3 sm:gap-4" : "flex gap-4 px-2 sm:gap-5"}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: embedded ? 42 : 48, ease: "linear", repeat: Infinity }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className={
              embedded
                ? "group relative w-[220px] shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30 sm:w-[260px] md:w-[280px]"
                : "group relative w-[280px] shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-background shadow-lg ring-1 ring-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-2xl dark:ring-white/10 sm:w-[300px] md:w-[320px]"
            }
          >
            <div className="relative aspect-video">
              <Image
                src={image}
                alt=""
                className="object-cover transition duration-300 group-hover:opacity-95"
                sizes={embedded ? "(max-width: 640px) 220px, 280px" : "(max-width: 640px) 280px, 320px"}
                width={embedded ? 280 : 320}
                height={embedded ? 158 : 200}
                loading={index < 4 ? "eager" : "lazy"}
                priority={index < 4}
                fetchPriority={index < 4 ? "high" : undefined}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );

  if (embedded) {
    return track;
  }

  return (
    <div className="relative w-full">
      <div className="mb-8 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Gallery</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Moments from the community
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Hackathons, showcases, and wins — a living scrapbook of what SDGP teams ship together.
        </p>
      </div>
      {track}
    </div>
  );
}
