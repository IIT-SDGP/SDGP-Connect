// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import Image from "next/image";
import React from "react";

interface HeroSectionProps {
  coverImage: string | undefined;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ coverImage }) => {
  return (
    <div className="relative bg-black">
      {/* Mobile layout: full screen width, image contained */}
      <div className="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen aspect-[16/9] sm:hidden">
        <Image
          fill
          src={coverImage || "https://placehold.co/600x400/png?text=NO+IMAGE"}
          alt="Project Cover"
          className="object-contain"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Desktop layout: full screen width and height */}
      <div className="hidden sm:block relative w-full h-[70vh] min-h-[500px]">
        <Image
          fill
          src={coverImage || "https://placehold.co/600x400/png?text=NO+IMAGE"}
          alt="Project Cover"
          className="w-full h-full object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>
    </div>
  );
};
