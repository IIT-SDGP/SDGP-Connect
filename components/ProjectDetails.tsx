// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetProjectDetailsByID } from "@/hooks/project/useGetProjectDetailsByID";
import { AssociationType } from "@/types/prisma-types";
import { projectTypeOptions, sdgGoals, techStackOptions } from "@/lib/types/mapping";
import {
  AlertCircle,
  Blocks,
  Sparkles,
  Leaf,
  Globe,
  Layers,
} from "lucide-react";
import { HeroSection } from "./s-project/hero-section";
import { ProjectHeader } from "./s-project/project-header";
import { ProjectOverview } from "./s-project/project-overview";
import { SlideDeck } from "./s-project/slide-deck";
import Teamandsocial from "./s-project/team-social";
import { Spinner } from "./ui/spinner";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { IconType } from "react-icons";
import { projectContentInset, cn } from "@/lib/utils";

function SnapshotSection({
  title,
  icon,
  empty,
  children,
}: {
  title: string;
  icon: ReactNode;
  empty: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 border-t border-border/50 pt-4">
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-tight text-foreground">
        {icon}
        {title}
      </p>
      {children ?? <p className="text-xs leading-relaxed text-muted-foreground">{empty}</p>}
    </div>
  );
}

const ProjectDetails = ({ projectID }: { projectID: string }) => {
  const { project, isLoading, error } = useGetProjectDetailsByID(projectID);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner variant="ring" className="size-24" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Project Not Found</AlertTitle>
        <AlertDescription>
          The requested project could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  const associations = project.content?.associations ?? [];
  const sdgAssociations = associations.filter((a) => a.type === AssociationType.PROJECT_SDG);
  const domainAssociations = associations.filter((a) => a.type === AssociationType.PROJECT_DOMAIN);
  const typeAssociations = associations.filter((a) => a.type === AssociationType.PROJECT_TYPE);
  const techAssociations = associations.filter((a) => a.type === AssociationType.PROJECT_TECH);
  const validSdgAssociations = sdgAssociations.filter((association) =>
    sdgGoals.some((goal) => goal.name === association.sdgGoal)
  );
  const domainBadgesForHeader = domainAssociations
    .map((a) => a.domain)
    .filter((d): d is NonNullable<typeof d> => d != null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <HeroSection
        coverImage={project.metadata.cover_image}
        className={projectContentInset}
      />
      <div className={cn("mx-auto w-full max-w-7xl pb-16 sm:pb-20", projectContentInset, "px-3 sm:px-4")}>
        <ProjectHeader
          title={project.metadata.title}
          subtitle={project.metadata.subtitle}
          domains={domainBadgesForHeader}
          status={project.content?.status?.status}
          logo={project.metadata.logo}
          website={project.metadata.website}
          projectId={project.metadata.project_id}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 space-y-6 lg:col-span-8 xl:col-span-9">
            <ProjectOverview
              problemStatement={project.content?.projectDetails?.problem_statement}
              solution={project.content?.projectDetails?.solution}
              keyFeatures={project.content?.projectDetails?.features}
              teamNumber={project.metadata.group_num}
              projectYear={project.metadata.sdgp_year}
            />
            <SlideDeck slides={project.content?.slides || []} />
          </div>

          <aside className="min-w-0 lg:col-span-4 xl:col-span-3">
            <Card className="z-10 max-h-none overflow-x-hidden border bg-card/90 p-4 shadow-lg sm:p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem-env(safe-area-inset-bottom,0px))] lg:overflow-y-auto">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_90%_10%,rgba(99,102,241,0.14),transparent_40%)]" />
              <div className="relative space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Snapshot</p>
                  <h3 className="mt-1 text-lg font-semibold inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    Project Highlights
                  </h3>
                </div>

                <SnapshotSection
                  title="SDG Goals"
                  icon={<Leaf className="h-4 w-4 text-primary" />}
                  empty="No SDG goals tagged."
                >
                  {validSdgAssociations.length > 0 ? (
                    <ul className="space-y-2">
                      {validSdgAssociations.map((association) => {
                        const sdgGoal = sdgGoals.find((g) => g.name === association.sdgGoal);
                        if (!sdgGoal) return null;
                        return (
                          <li
                            key={association.id}
                            className="flex items-center gap-2 rounded-lg border bg-muted/25 px-2 py-1.5 text-xs"
                          >
                            <img
                              src={sdgGoal.icon}
                              alt=""
                              className="h-7 w-7 shrink-0 rounded bg-background object-contain p-0.5"
                            />
                            <span className="font-medium leading-snug">{sdgGoal.name.replace(/_/g, " ")}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </SnapshotSection>

                <SnapshotSection
                  title="Project Domains"
                  icon={<Globe className="h-4 w-4 text-primary" />}
                  empty="No domains associated."
                >
                  {domainAssociations.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {domainAssociations.map((d) => (
                        <Badge key={d.id} variant="secondary" className="text-[11px] font-normal">
                          {d.domain?.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </SnapshotSection>

                <SnapshotSection
                  title="Project Type"
                  icon={<Layers className="h-4 w-4 text-primary" />}
                  empty="No project types associated."
                >
                  {typeAssociations.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {projectTypeOptions
                        .filter((type) => typeAssociations.some((a) => a.projectType === type.value))
                        .map((type) => {
                          const Icon = type.icon as IconType;
                          return (
                            <Badge
                              key={type.value}
                              variant="outline"
                              className="gap-1 pr-2 pl-2 text-[11px] font-normal"
                            >
                              {Icon ? <Icon className="h-3 w-3" /> : null}
                              {type.label}
                            </Badge>
                          );
                        })}
                    </div>
                  ) : null}
                </SnapshotSection>

                <SnapshotSection
                  title="Tech Stack"
                  icon={<Blocks className="h-4 w-4 text-primary" />}
                  empty="No technologies associated."
                >
                  {techAssociations.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {techAssociations.map((tech) => {
                        const meta = techStackOptions.find((s) => s.value === tech.techStack);
                        if (!meta) return null;
                        const IconC = meta.icon;
                        return (
                          <Badge
                            key={tech.id}
                            variant="secondary"
                            className="gap-1 border border-border/80 bg-muted/40 pr-2 pl-2 text-[11px] font-normal"
                          >
                            <IconC className="h-3.5 w-3.5 shrink-0" />
                            {meta.label}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : null}
                </SnapshotSection>
              </div>
            </Card>
          </aside>
        </div>

        <div className="mt-6">
          <Teamandsocial
            teamMembers={project.content?.team || []}
            teamSocials={project.content?.socialLinks || []}
            teamPhone={project.content?.projectDetails?.team_phone}
            teamEmail={project.content?.projectDetails?.team_email}
            projectTitle={project.metadata.title}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
