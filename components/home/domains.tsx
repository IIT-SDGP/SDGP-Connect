"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Icon, Layers3 } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { projectDomainsOptions } from "@/types/project/mapping";
import React from "react";
import Link from "next/link";



export default function Domains() {
  return (
    <section className="bg-background py-24">
      <div className="">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge className="mb-6 inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
    <Layers3 className="h-4 w-4" />
    Project Domains
  </Badge>
  <h2 className="mb-6 text-pretty text-3xl font-bold tracking-tight lg:text-4xl">
    Explore Key Innovation Domains
  </h2>
  <p className="mb-10 text-lg text-muted-foreground">
    Discover a wide range of technology domains driving the future — from AI and Blockchain to Sustainability and Gaming. These categories represent where impactful ideas and projects come to life.
  </p>
        </div>

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
                    <a
                      href={"projects?domain=" + domain.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-muted/60 p-6 transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-sm"
                    >
                      <div className="relative flex h-16 w-full items-center justify-center">
                        {domain.icon && React.createElement(domain.icon, { className: "h-8 w-8 text-foreground" })}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          {domain.label}
                        </p>
                      </div>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent"></div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
            <Link href="/projects" >
          <Button variant="outline" className="group" size="lg">
            View projects of all domains
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
