// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { Button } from "@/components/ui/button";
import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowRight, Layers3 } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { projectDomainsOptions } from "@/lib/types/mapping";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/hooks/LanguageProvider";
import { CornerBrackets } from "@/components/home/corner-brackets";

function getNested(obj: any, path: string[], fallback: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), obj);
}

export default function Domains() {
  const { t } = useLanguage();
  const domains = getNested(t, ['home', 'domains'], {});

  return (
    <section className="w-full py-12 md:py-14 lg:py-[5.5rem] text-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-4">

          {/* Badge */}
          <div className="flex items-center justify-center mb-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2a5298]/50 bg-[#2a5298]/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">
              <Layers3 className="h-3.5 w-3.5" />
              {domains.badge || "Project domains"}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-4xl mx-auto leading-tight">
            {domains.heading || "Explore key Innovation domains"}
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-[700px] mx-auto mt-4 mb-8 leading-relaxed">
            {domains.description || "Discover a wide range of technology domains driving the future from AI and Blockchain to Sustainability and Gaming. These categories represent where impactful ideas and projects come to life."}
          </p>

        </div>

        {/* Carousel */}
        <div className="pt-8">
          <div className="relative mx-auto flex items-center justify-center overflow-hidden">
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[
                AutoScroll({
                  playOnInit: true,
                  stopOnInteraction: false,
                  speed: 0.7,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {projectDomainsOptions.map((domain) => (
                  <CarouselItem
                    key={domain.value}
                    className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                  >
                    <Link
                      href={"project?domains=" + domain.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 transition-colors duration-300 hover:border-zinc-700 overflow-hidden"
                    >
                      <CornerBrackets />
                      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />
                      <div className="relative flex h-16 w-full items-center justify-center">
                        {domain.icon && React.createElement(domain.icon, { className: "h-8 w-8 text-zinc-300 group-hover:text-white transition-colors duration-300" })}
                      </div>
                      <p className="font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 text-sm text-center">
                        {domain.label}
                      </p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/project">
            <Button
              variant="outline"
              size="lg"
              className="group border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all duration-300 rounded-full"
            >
              {domains.button || "View projects of all domains"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}