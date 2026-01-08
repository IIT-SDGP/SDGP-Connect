// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import type { ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowDownRight, Clock1 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AwardsHeroProps {
  badgeText?: string;
  badgeIcon?: ElementType;
  title?: string;
  description?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string | null;
  avatarUrl?: string;
}

const AwardsHero = ({
  badgeText,
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  startDate,
  endDate,
  imageUrl,
  avatarUrl,
}: AwardsHeroProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  return (
    <section className="bg-background py-16 text-foreground sm:py-32">
      <div className="container mx-auto">
        <div className="flex w-full flex-col-reverse lg:flex-row items-center justify-center gap-10">
          {/* Text Content Container - Fixed Width 50% */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center mx-auto text-center lg:text-left lg:items-start">
            <Badge variant="outline">
              {badgeText}
            </Badge>

            {/* Title and Avatar in the same row */}
            <div className="flex items-center gap-4 w-full justify-center lg:justify-start my-6">
              {avatarUrl && (
                <Avatar className="size-12">
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              )}
              <h1 className="text-pretty text-2xl font-bold lg:text-4xl m-0">
                {title}
              </h1>
            </div>

            <p className={`mb-2 text-muted-foreground ${showFullDescription ? '' : 'line-clamp-4'}`}>{description}</p>
            {description && (
              <button
                className="text-primary underline text-sm"
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            )}
            {/* Avatar and Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start mt-4 items-center">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href={primaryButtonLink}>
                  <Button size={"lg"}>{primaryButtonText}</Button>
                </Link>
                <Link href={secondaryButtonLink}>
                  <Button variant={"outline"} size={"lg"}>
                    {secondaryButtonText}
                  </Button>
                </Link>
              </div>
            </div>

            <Separator className="my-7" />
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Clock1 className="size-4 text-primary" />
                <span className="font-semibold">Start date:</span>
                <span>{startDate ? new Date(startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : '-'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock1 className="size-4 text-primary" />
                <span className="font-semibold">End date:</span>
                <span>{endDate ? new Date(endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : '-'}</span>
              </li>
            </ul>
          </div>

          {/* Image Container - Fixed Width 50% */}
          <div className="lg:w-1/2 flex items-center justify-center mx-auto">
            <Image
              src={imageUrl || "/images/placeholder.png"}
              alt={title || "Competition Image"}
              width={400}
              height={200}
              className="h-auto w-4/5 rounded-lg object-cover aspect-[4/2]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { AwardsHero };
