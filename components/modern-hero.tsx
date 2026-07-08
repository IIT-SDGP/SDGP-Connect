// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Star } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero7 = ({
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  button = {
    text: "Discover all components",
    url: "https://www.shadcnblocks.com",
  },
  reviews = {
    count: 200,
    avatars: [],
  },
}: Hero7Props) => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-y-8 left-0 hidden w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent md:top-24 md:block md:bottom-24 lg:left-8" />

      <div className="container mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-stretch lg:gap-20">
          <div className="flex flex-col justify-center space-y-8 lg:pl-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              SDGP at IIT
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[2.75rem] lg:leading-[1.1]">
              {heading}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
              {description}
            </p>
            <div>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 font-medium shadow-md shadow-primary/15"
              >
                {/^https?:\/\//.test(button.url) ? (
                  <a href={button.url} target="_blank" rel="noopener noreferrer">
                    {button.text}
                  </a>
                ) : (
                  <Link href={button.url}>{button.text}</Link>
                )}
              </Button>
            </div>
          </div>

          <div className="relative flex">
            <div
              className="absolute -left-2 -right-2 top-6 bottom-6 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-chart-2/15 blur-2xl md:-left-4 md:-right-4"
              aria-hidden
            />
            <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-card/90 via-card/50 to-card/30 p-8 shadow-xl backdrop-blur-xl dark:from-card/50 dark:via-card/30 dark:to-card/20 md:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <span className="inline-flex -space-x-4">
                  {reviews.avatars.map((avatar, index) => (
                    <Avatar
                      key={index}
                      className="size-14 border-2 border-background shadow-md ring-2 ring-primary/10"
                    >
                      <AvatarImage src={avatar.src} alt={avatar.alt} />
                    </Avatar>
                  ))}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="size-4 fill-amber-400 text-amber-400 sm:size-[1.15rem]"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    <span className="tabular-nums text-lg font-semibold text-primary">{reviews.count}+</span>
                    <span className="text-muted-foreground"> teams building real products</span>
                  </p>
                </div>
              </div>

              <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              <blockquote className="text-pretty text-base italic leading-relaxed text-muted-foreground md:text-lg">
                &ldquo;Coursework that graduates into startups — mentorship, shipping culture, and peers who
                push you further.&rdquo;
              </blockquote>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
                From cohort to company
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero7 };
