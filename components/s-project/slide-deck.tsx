// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Maximize, X } from "lucide-react";
import { IProjectSlide } from "@/types/project/type";
import { NoMedia } from "../Empty-states/emptyState";

interface SlideDeckProps {
  slides?: IProjectSlide[];
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ slides }) => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  if (!slides) slides = [];

  const openModal = (index: number) => {
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  const prevImage = () => {
    if (modalIndex === null) return;
    setModalIndex((modalIndex - 1 + slides.length) % slides.length);
  };

  const nextImage = () => {
    if (modalIndex === null) return;
    setModalIndex((modalIndex + 1) % slides.length);
  };

  // Optional: keyboard navigation
  React.useEffect(() => {
    if (modalIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalIndex]);

  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>

      {slides.length > 0 ? (
        <>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={slide.id}>
                <div className="relative cursor-pointer overflow-hidden rounded-lg group">
                  <img
                    src={slide.slides_content}
                    loading="lazy"
                    alt="Slide image"
                    className="w-full aspect-video object-cover object-left-top transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openModal(idx)}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full"
                      onClick={() => openModal(idx)}
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Modal */}
          {modalIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
                {/* Prev Button */}
                <Button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-50"
                  aria-label="Previous image"
                >
                  ‹
                </Button>

                {/* Image container */}
                <img
                  src={slides[modalIndex].slides_content}
                  alt="Fullscreen slide"
                  className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                />

                {/* Next Button */}
                <Button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-50"
                  aria-label="Next image"
                >
                  ›
                </Button>

                {/* Close Button */}
                <Button
                  className="absolute top-6 right-6 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-black" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <NoMedia />
      )}

      {/* Custom Swiper Navigation Styling */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 9999px;
          width: 40px;
          height: 40px;
          color: #000;
          transition: background 0.2s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 1);
        }

        /* Force real arrow icons (avoid Swiper's ligature-based "prev/next") */
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-family: inherit !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1 !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
        }

        .swiper-button-prev:after {
          content: '‹' !important;
        }

        .swiper-button-next:after {
          content: '›' !important;
        }
      `}</style>
    </Card>
  );
};
