// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight, GalleryHorizontal, Maximize2, X } from "lucide-react";
import { IProjectSlide } from "@/types/project/type";
import { NoMedia } from "../Empty-states/emptyState";
import { cn } from "@/lib/utils";

interface SlideDeckProps {
  slides?: IProjectSlide[];
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ slides: slidesProp }) => {
  const slides = slidesProp ?? [];
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const openModal = (index: number) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);

  const prevImage = useCallback(() => {
    setModalIndex((i) =>
      i === null ? null : (i - 1 + slides.length) % slides.length
    );
  }, [slides.length]);

  const nextImage = useCallback(() => {
    setModalIndex((i) => (i === null ? null : (i + 1) % slides.length));
  }, [slides.length]);

  useEffect(() => {
    if (modalIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [modalIndex, prevImage, nextImage]);

  return (
    <Card className="border bg-card/90 p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-start gap-2.5 text-lg font-semibold sm:items-center sm:gap-3 sm:text-xl">
          <span className="inline-flex shrink-0 rounded-lg bg-cyan-500/15 p-2 ring-1 ring-cyan-500/30">
            <GalleryHorizontal className="h-5 w-5 text-cyan-600 dark:text-cyan-400" aria-hidden />
          </span>
          <span className="pt-0.5 sm:pt-0">Project Gallery</span>
        </h3>
        {slides.length > 0 ? (
          <Badge variant="secondary" className="w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium">
            {slides.length} {slides.length === 1 ? "image" : "images"}
          </Badge>
        ) : null}
      </div>

      {slides.length > 0 ? (
        <>
          <div className="mt-4 flex items-center gap-2 sm:mt-5 sm:gap-3">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiper?.slidePrev()}
              className={cn(
                "hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex",
                "border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-sm",
                "transition hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              )}
              disabled={slides.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <div className="min-w-0 flex-1">
              <Swiper
                modules={[Autoplay, Pagination]}
                onSwiper={setSwiper}
                autoHeight
                spaceBetween={12}
                slidesPerView={1}
                loop={slides.length > 1}
                autoplay={
                  slides.length > 1
                    ? {
                        delay: 5200,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                pagination={{
                  clickable: true,
                  dynamicBullets: slides.length > 5,
                }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 14 },
                  1024: { slidesPerView: 3, spaceBetween: 16 },
                }}
                className="project-gallery-swiper"
              >
                {slides.map((slide, idx) => (
                  <SwiperSlide key={slide.id} className="!h-auto">
                    <button
                      type="button"
                      onClick={() => openModal(idx)}
                      className={cn(
                        "group relative block w-full overflow-hidden rounded-xl text-left",
                        "ring-1 ring-border/60 shadow-sm transition",
                        "hover:ring-primary/35 hover:shadow-md",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <div className="relative w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.slides_content}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                          alt={`Gallery image ${idx + 1} of ${slides.length}`}
                          className="block h-auto w-full max-w-full transition duration-500 group-hover:scale-[1.02]"
                          onLoad={() => {
                            requestAnimationFrame(() => swiper?.updateAutoHeight(0));
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                        <div className="flex items-center justify-between gap-2 p-3">
                          <span className="rounded-md bg-white/15 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {idx + 1} / {slides.length}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                            <Maximize2 className="h-3.5 w-3.5" />
                            View
                          </span>
                        </div>
                      </div>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiper?.slideNext()}
              className={cn(
                "hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex",
                "border border-border/80 bg-background/95 text-foreground shadow-md backdrop-blur-sm",
                "transition hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              )}
              disabled={slides.length <= 1}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>

          {modalIndex !== null ? (
            <div
              className="fixed inset-0 z-[100] flex flex-col bg-background/88 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl dark:bg-black/88"
              role="dialog"
              aria-modal="true"
              aria-label="Gallery viewer"
            >
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card/50 px-4 py-3 backdrop-blur-md md:px-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Project Gallery
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Image{" "}
                    <span className="tabular-nums text-primary">{modalIndex + 1}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="tabular-nums text-muted-foreground">{slides.length}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    ← → navigate · Esc close
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-full border border-border/80"
                    onClick={closeModal}
                    aria-label="Close gallery"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </header>

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute left-1 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full sm:left-3 md:left-6",
                    "border border-border/80 bg-card/90 shadow-lg backdrop-blur-sm"
                  )}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
                </Button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slides[modalIndex]?.slides_content}
                  alt={`Gallery image ${modalIndex + 1} of ${slides.length}`}
                  className="mx-auto max-h-[min(90dvh,calc(100dvh-6.5rem))] w-auto max-w-[min(100%,calc(100vw-7rem))] rounded-xl object-contain shadow-2xl ring-1 ring-border/40 sm:max-w-[min(100%,calc(100vw-9rem))] md:max-h-[min(92dvh,calc(100dvh-5.5rem))] md:max-w-[min(1400px,calc(100vw-11rem))]"
                />

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full sm:right-3 md:right-6",
                    "border border-border/80 bg-card/90 shadow-lg backdrop-blur-sm"
                  )}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2.25} />
                </Button>
              </div>
            </div>
          ) : null}

            <style jsx global>{`
              .project-gallery-swiper .swiper-pagination {
                position: relative !important;
                bottom: auto !important;
                left: 0 !important;
                width: 100%;
                margin-top: 0.375rem;
                padding-bottom: 0;
                transform: none !important;
                text-align: center;
              }
              .project-gallery-swiper .swiper-pagination-bullet {
                width: 0.45rem;
                height: 0.45rem;
                margin: 0 0.2rem !important;
                background: color-mix(in oklch, var(--foreground) 30%, transparent);
                opacity: 1;
                transition: width 0.2s ease, background 0.2s ease;
              }
              .project-gallery-swiper .swiper-pagination-bullet-active {
                width: 1.35rem;
                border-radius: 9999px;
                background: var(--primary);
              }
            `}</style>
          </>
        ) : (
          <NoMedia />
        )}
    </Card>
  );
};
