// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useGetProjectDetailsByID } from "@/hooks/project/useGetProjectDetailsByID";
import { IProjectAssociation } from "@/types/project/type";
import { ProjectDomainEnum } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { HeroSection } from "./s-project/hero-section";
import { ProjectAssociation } from "./s-project/project-associations";
import { ProjectHeader } from "./s-project/project-header";
import { ProjectOverview } from "./s-project/project-overview";
import { SlideDeck } from "./s-project/slide-deck";
import Teamandsocial from "./s-project/team-social";
import { Spinner } from "./ui/spinner";

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

  return (
    <div className="min-h-screen ">
      <HeroSection coverImage={project.metadata.cover_image} />
      <div className="container mx-auto px-4 pb-16">
        <ProjectHeader
          title={project.metadata.title}
          subtitle={project.metadata.subtitle}
          domains={(project.content?.associations || [])
            .filter(
              (
                association
              ): association is IProjectAssociation & {
                domain: NonNullable<IProjectAssociation["domain"]>;
              } => association.domain != null
            )
            .map((association) => association.domain)}
          status={project.content?.status?.status}
          logo={project.metadata.logo}
          website={project.metadata.website}
          projectId={project.metadata.project_id}
        />
        <ProjectOverview
          problemStatement={project.content?.projectDetails?.problem_statement}
          solution={project.content?.projectDetails?.solution}
          keyFeatures={project.content?.projectDetails?.features}
          teamNumber={project.metadata.group_num}
          projectYear={project.metadata.sdgp_year}
        />
        {project.content?.slides && (
          <SlideDeck slides={project.content?.slides} />
        )}
        <ProjectAssociation
          associations={project.content?.associations || []}
        />
        <Teamandsocial
          teamMembers={project.content?.team || []}
          teamSocials={project.content?.socialLinks || []}
          teamPhone={project.content?.projectDetails?.team_phone}
          teamEmail={project.content?.projectDetails?.team_email}
          projectTitle={project.metadata.title}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
