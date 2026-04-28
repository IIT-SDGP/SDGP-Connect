// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import React from "react";
import { Card } from "../ui/card";
import { ExternalLink, Linkedin, Mail, MessageCircle, Phone, Users } from "lucide-react";
import Link from "next/link";
import { IProjectSocialLink, IProjectTeam } from "@/types/project/type";
import Image from "next/image";
import { socialPlatformMap } from "@/lib/types/mapping";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

/** Brand-forward icon tints (icon + subtle tile background). */
const SOCIAL_BRAND: Record<string, { ring: string; icon: string }> = {
  LINKEDIN: { ring: "bg-[#0A66C2]/15 ring-[#0A66C2]/25", icon: "text-[#0A66C2]" },
  TWITTER: { ring: "bg-[#1D9BF0]/15 ring-[#1D9BF0]/25", icon: "text-[#1D9BF0]" },
  INSTAGRAM: { ring: "bg-[#E4405F]/15 ring-[#E4405F]/25", icon: "text-[#E4405F]" },
  FACEBOOK: { ring: "bg-[#1877F2]/15 ring-[#1877F2]/25", icon: "text-[#1877F2]" },
  YOUTUBE: { ring: "bg-[#FF0000]/12 ring-[#FF0000]/20", icon: "text-[#FF0000]" },
  TIKTOK: { ring: "bg-[#ff0050]/12 ring-cyan-500/20", icon: "text-[#ff0050]" },
};

interface Props {
  teamEmail?: string;
  teamPhone?: string;
  projectTitle?: string;
  teamMembers: IProjectTeam[];
  teamSocials: IProjectSocialLink[];
}

function ConnectTile({
  href,
  label,
  sub,
  children,
  className,
}: {
  href: string;
  label: string;
  sub: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      target={href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/80 bg-card/40 p-4 transition-all hover:border-primary/30 hover:bg-muted/45 hover:shadow-sm",
        className
      )}
    >
      {children}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground" title={sub}>
          {sub}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-40 transition group-hover:opacity-100" />
    </Link>
  );
}

const Teamandsocial = ({
  teamEmail,
  teamPhone,
  teamMembers,
  teamSocials,
  projectTitle,
}: Props) => {
  const email = teamEmail || "team@example.com";
  const hasRealPhone = Boolean(teamPhone && teamPhone !== "0000000000");

  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden border p-5 shadow-sm sm:p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">People & Communication</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Team and Contact Hub</h2>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {teamMembers.length} members
          </Badge>
        </div>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-0">
          <div className="space-y-4 lg:border-r lg:border-border/60 lg:pr-10">
            <h3 className="text-lg font-semibold tracking-tight">Contact & social</h3>
            <p className="text-sm text-muted-foreground">
              Email and phone details below; social profiles are quick icon links.
            </p>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contact
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ConnectTile href={`mailto:${email}`} label="Email" sub={email}>
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EA4335]/15 ring-1 ring-[#EA4335]/25"
                    aria-hidden
                  >
                    <Mail className="h-5 w-5 text-[#EA4335]" />
                  </span>
                </ConnectTile>

                {hasRealPhone ? (
                  <>
                    <ConnectTile
                      href={`https://api.whatsapp.com/send?phone=${teamPhone!.replace(/\D/g, "")}&text=${encodeURIComponent(
                        `Hey there! I'm interested in learning more about your project "${projectTitle}".`
                      )}`}
                      label="WhatsApp"
                      sub={teamPhone!}
                    >
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#25D366]/15 ring-1 ring-[#25D366]/30"
                        aria-hidden
                      >
                        <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      </span>
                    </ConnectTile>
                    <ConnectTile href={`tel:${teamPhone}`} label="Phone" sub={teamPhone!}>
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-500/15 ring-1 ring-teal-500/25"
                        aria-hidden
                      >
                        <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </span>
                    </ConnectTile>
                  </>
                ) : null}
              </div>
            </div>

            {teamSocials.length > 0 ? (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Social
                </p>
                <div className="flex flex-wrap gap-3">
                  {teamSocials.map((social, index) => {
                    const platform = socialPlatformMap[social.link_name];
                    if (!platform) return null;
                    const brand = SOCIAL_BRAND[social.link_name] ?? {
                      ring: "bg-primary/10 ring-primary/20",
                      icon: "text-primary",
                    };
                    const Icon = platform.icon;

                    return (
                      <Link
                        key={`${social.url}-${index}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={platform.label}
                        aria-label={`${platform.label} (opens in new tab)`}
                        className={cn(
                          "grid min-h-12 min-w-12 place-items-center rounded-xl p-3 ring-1 transition hover:scale-[1.06] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          brand.ring
                        )}
                      >
                        <Icon className={cn("h-6 w-6", brand.icon)} aria-hidden />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 lg:pl-10">
            <h3 className="text-lg font-semibold inline-flex items-center gap-2 tracking-tight">
              <Users className="h-5 w-5 text-primary" />
              Team
            </h3>
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 rounded-xl border bg-muted/10 p-3 text-center transition hover:bg-muted/25 sm:p-4"
                  >
                    <Image
                      src={member.profile_image || "/user.png"}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-border/60 sm:h-[4.5rem] sm:w-[4.5rem]"
                      width={72}
                      height={72}
                    />
                    <p
                      className="line-clamp-2 w-full text-sm font-medium leading-snug"
                      title={member.name}
                    >
                      {member.name}
                    </p>
                    {member.linkedin_url ? (
                      <Link
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#0A66C2]/12 p-2 text-[#0A66C2] transition hover:bg-[#0A66C2]/20"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4">
                Team members have not been listed yet.
              </p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Teamandsocial;
