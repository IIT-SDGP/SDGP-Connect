// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();

  const handleClick = () => {
    router.push("/contact");
  };

  const handleVideoClick = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative overflow-hidden mt-28 md:mt-0 md:py-32 lg:py-40 xl:py-48">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10" />

      <div className="container relative max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        <div className="grid items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 lg:grid-cols-2">
          {/* Content Section */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mt-8 space-y-4 lg:space-y-6 xl:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 lg:px-5 lg:py-2.5">
                <Zap className="size-4 lg:size-5 text-primary" />
                <span className="text-sm lg:text-base font-medium">
                  About Us
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-pretty text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight leading-tight">
                Welcome to <span className="text-primary">SDGP</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Explore student-led software solutions addressing real-world
                challenges aligned with the UN Sustainable Development Goals.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-8 lg:mt-10 xl:mt-12 flex w-full flex-col justify-center gap-3 sm:gap-4 sm:flex-row lg:justify-start">
              {/* Video Dialog */}
              <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="group relative w-full overflow-hidden sm:w-auto lg:text-base xl:text-lg"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-primary/10 transition-transform group-hover:translate-y-full" />
                    <Play className="mr-2 size-4 lg:size-5" />
                    Watch Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] 2xl:max-w-[1000px]">
                  <div className="relative aspect-video rounded-lg border shadow-lg">
                    <iframe
                      src="https://www.youtube.com/embed/7uZvGxbC-wA?end=2537&rel=0&autoplay=1&mute=0&cc_load_policy=1&controls=0&showinfo=0&modestbranding=1&disablekb=1&fs=0"
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full rounded-md"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Contact Button */}
              <Button
                size="lg"
                className="group w-full sm:w-auto lg:text-base xl:text-lg"
                onClick={handleClick}
              >
                Contact Us
                <ArrowRight className="ml-2 size-4 lg:size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          {/* Video Section */}
          <div className="relative order-first lg:order-last">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-dark/10 blur-sm" />
            <div className="relative overflow-hidden rounded-xl">
              {/* YouTube Video */}
              <div
                className="relative rounded-xl border border-gray-600 shadow-lg overflow-hidden cursor-pointer h-[400px] max-h-[400px]"

                onClick={handleVideoClick}
              >
                <iframe
                  src={`https://www.youtube.com/embed/4sECecnNtY0?rel=0&autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=4sECecnNtY0&cc_load_policy=1&controls=0&showinfo=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3`}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={false}
                  className="absolute inset-0 w-full h-full rounded-xl z-10 pointer-events-none"
                />
                
                {/* Invisible overlay to handle clicks */}
                <div className="absolute inset-0 z-20" />
                
                {/* Mute indicator */}
                {isMuted && (
                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4 rounded-full bg-black/50 backdrop-blur-sm p-2 z-30">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden 2xl:block h-16" />
    </section>
  );
}