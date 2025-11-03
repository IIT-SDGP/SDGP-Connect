// © 2025 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  '/assets/Dialog.webp',
  '/assets/1.webp',
  '/assets/inno.webp',
  '/assets/2.webp',
  '/assets/Codesprint.webp',
  '/assets/4.webp',
  '/assets/3.webp',
  '/assets/innovex.webp',
  '/assets/movemate1.webp',
  '/assets/win.webp',
  '/assets/3.webp',
  '/assets/dialog-ino.webp',
];

export default function Carousel() {
  const duplicatedImages = [...images, ...images];
  
  return (
    <div className=" mt-8 relative w-full overflow-hidden h-calc-[calc(100vh-4rem)] md:h-calc-[calc(100vh-6rem)] lg:h-calc-[calc(100vh-8rem)]">
      <div className="absolute top-0 h-full w-32 pointer-events-none z-10 left-0 bg-gradient-to-r from-background to-transparent" />
      <motion.div
        className="carousel-track flex gap-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 17, ease: 'linear', repeat: Infinity }}
      >
        {duplicatedImages.map((image, index) => (
            <div key={index} className="flex-none relative rounded-lg overflow-hidden w-[400px] aspect-video">
            <Image
              src={image}
              alt={`Carousel image ${index + 1}`}
              className="object-cover"
              // Serve responsive images for better performance
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              width={400}
              height={225}
              loading={index < 3 ? "eager" : "lazy"}                // load first 3 immediately
              priority={index < 3}                                   // Next.js preloads first 3
              fetchPriority={index < 3 ? "high" : undefined}  
            />
            </div>
        ))}
      </motion.div>
      <div className="absolute top-0 h-full w-32 pointer-events-none z-10 right-0 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}