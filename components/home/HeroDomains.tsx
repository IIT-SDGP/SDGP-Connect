// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'

import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { projectDomainsOptions } from '@/lib/types/mapping';

export function HeroDomains({ className = "" }: { className?: string }) {
  // Repeat domains for smooth infinite scroll
  const repeatedDomains = [...projectDomainsOptions, ...projectDomainsOptions];

  return (
    <div className={`relative h-[100px] w-full ${className}`}>
      <InfiniteSlider
        className="flex h-full w-full items-center"
        duration={60} // slower speed
        gap={64} // more gap between cards
      >
        {repeatedDomains.map((domain, index) => (
          <div
            key={domain.value + index}
            className="flex justify-center items-center h-[64px] shrink-0 px-4"
          >
            <span className="text-white font-bold text-lg sm:text-xl uppercase text-center whitespace-nowrap">
              {domain.label}
            </span>
          </div>
        ))}
      </InfiniteSlider>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-36 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-36 bg-gradient-to-l from-black via-black/80 to-transparent" />
    </div>
  );
}
