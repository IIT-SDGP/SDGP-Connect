// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { Badge } from "@/components/ui/badge";
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

function getNested(obj: Record<string, unknown>, path: string[], fallback: unknown = undefined) {
  return path.reduce(
    (acc, key) =>
      acc && typeof acc === "object" && (acc as Record<string, unknown>)[key] !== undefined
        ? (acc as Record<string, unknown>)[key]
        : fallback,
    obj as unknown
  );
}

export default function Domains() {
  const { t } = useLanguage();
  const domains = (getNested(t as Record<string, unknown>, ["home", "domains"], {}) ||
    {}) as Record<string, string>;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background dark:from-muted/15" />

      <div className="container relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-6 inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Layers3 className="h-3.5 w-3.5" aria-hidden />
            {domains.badge || "Project domains"}
          </Badge>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {domains.heading || "Explore key innovation domains"}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            {domains.description ||
              "Discover a wide range of technology domains driving the future — from AI and Blockchain to Sustainability and Gaming. These categories represent where impactful ideas and projects come to life."}
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-5 shadow-xl backdrop-blur-xl dark:from-card/40 dark:via-card/25 dark:to-muted/10 md:p-8">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-foreground/[0.02] dark:bg-foreground/[0.04]" />
          <div className="relative">
            <Carousel
              opts={{ loop: true, align: "start" }}
              plugins={[
                AutoScroll({
                  playOnInit: true,
                  stopOnInteraction: false,
                  speed: 0.65,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {projectDomainsOptions.map((domain) => (
                  <CarouselItem
                    key={domain.value}
                    className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6"
                  >
                    <Link
                      href={`/project?domains=${domain.value}`}
                      className="group flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-background/70 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.06] hover:shadow-lg dark:bg-background/40"
                    >
                      <div className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 transition group-hover:from-primary/15 group-hover:to-primary/5">
                        {domain.icon &&
                          React.createElement(domain.icon, {
                            className:
                              "h-8 w-8 text-foreground transition group-hover:scale-110 group-hover:text-primary",
                          })}
                      </div>
                      <p className="text-center text-sm font-medium leading-snug text-foreground">
                        {domain.label}
                      </p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-background/95 to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background/95 to-transparent md:w-24" />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group h-12 rounded-full border-primary/30 bg-background/60 px-8 text-base font-medium backdrop-blur-sm hover:bg-primary/10"
          >
            <Link href="/project">
              {domains.button || "View projects of all domains"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
