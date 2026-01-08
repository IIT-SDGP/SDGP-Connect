// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Banner3Props {
  badgeText?: string;
  message?: string;
  linkText?: string;
  linkHref?: string;
}

function Banner3({
  badgeText = "New",
  message = "",
  linkText = "Learn more",
  linkHref = "/blog",
}: Banner3Props) {
  const [isVisible, setIsVisible] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const endY = e.changedTouches[0].clientY;
    if (touchStartY.current !== null && touchStartY.current - endY > 30) {
      setIsVisible(false);
    }
    touchStartY.current = null;
  };

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative flex flex-wrap items-center gap-2 sm:gap-3 bg-secondary backdrop-blur-md rounded-xl shadow-2xl border border-black px-3 py-2 sm:px-4 sm:py-2.5 w-[90vw] max-w-md sm:max-w-xl">
  
        <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 overflow-hidden">
          <Badge className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-xl text-[10px] sm:text-xs font-medium bg-secondary text-white border border-grey/20 shrink-0">
            {badgeText}
          </Badge>
          <span className="text-white/90 font-medium text-[11px] sm:text-sm truncate">
            {message}
          </span>
        </div>

        {linkHref && linkText && (
          <a
            href={linkHref}
            className="inline-flex items-center gap-1 text-[9px] sm:text-sm font-semibold transition-colors duration-200 group bg-white/10 px-2 py-0.5 rounded whitespace-nowrap shrink-0"
          >
            {linkText}
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 border border-white/30 hover:border-white/50 h-5 w-5 sm:h-6 sm:w-6"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(false);
          }}
          aria-label="Close banner"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}

export { Banner3 };
