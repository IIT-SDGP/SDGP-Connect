// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Globe2Icon, Hash, Layers, Share2Icon, Star } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ProjectDomainEnum, ProjectStatusEnum } from "@/types/prisma-types";

interface ProjectHeaderProps {
  title: string;
  subtitle?: string;
  domains?: ProjectDomainEnum[];
  status?: ProjectStatusEnum;
  logo?: string;
  website?: string;
  projectId: string;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  subtitle,
  domains,
  status,
  logo,
  website,
  projectId,
}) => {
  const statusTone: Record<ProjectStatusEnum, string> = {
    IDEA: "bg-sky-500/15 text-sky-400 border-sky-400/40",
    MVP: "bg-violet-500/15 text-violet-400 border-violet-400/40",
    RESEARCH: "bg-amber-500/15 text-amber-400 border-amber-400/40",
    DEPLOYED: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    STARTUP: "bg-pink-500/15 text-pink-400 border-pink-400/40",
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    const shareText = `Check out ${title} project: `;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch {
        alert("Failed to copy link.");
      }
    }
  };

  return (
    <section className="-mt-14 relative z-10 sm:-mt-20 md:-mt-24">
      <div className="relative overflow-hidden rounded-2xl border bg-background/92 p-4 shadow-2xl backdrop-blur-md sm:p-5 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_16%,rgba(99,102,241,0.16),transparent_35%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="relative min-w-0 space-y-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-14 shrink-0 border bg-muted/70 ring-1 ring-primary/15 sm:size-16 flex items-center justify-center text-center">
                <AvatarImage src={logo} alt={title} />
                <AvatarFallback className="text-foreground font-bold">
                  {logo ? "" : title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-balance break-words text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-2 max-w-4xl text-sm text-muted-foreground sm:text-base md:text-lg">{subtitle}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {status ? (
                <Badge variant="outline" className={statusTone[status]}>
                  <Layers className="mr-1 h-3.5 w-3.5" />
                  {status.replace("_", " ")}
                </Badge>
              ) : null}
              {domains?.map((domain) => (
                <Badge key={domain} variant="secondary" className="capitalize">
                  {domain.replace(/_/g, " ").toLowerCase()}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground min-[480px]:grid-cols-2 xl:grid-cols-3">
              <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                <Hash className="h-4 w-4" />
                <span>ID: {projectId}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                <Calendar className="h-4 w-4" />
                <span>Project Showcase</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                <Star className="h-4 w-4" />
                <span>Featured Case Study Layout</span>
              </div>
            </div>
          </div>

          <div className="relative flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:justify-end md:pt-1">
            {website && (
              <Button asChild className="w-full font-semibold shadow-sm sm:w-auto">
                <Link href={website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  Visit Website <Globe2Icon size={16} />
                </Link>
              </Button>
            )}
            <Button
              onClick={handleShare}
              className="w-full font-semibold sm:w-auto"
              variant={"outline"}
            >
              Share <Share2Icon className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
