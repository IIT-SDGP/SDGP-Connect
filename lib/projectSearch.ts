import { prisma } from "@/prisma/prismaClient";
import {
  ProjectDomainEnum,
  ProjectTypeEnum,
  SDGGoalEnum,
  TechStackEnum,
  ProjectStatusEnum,
} from "@prisma/client";

export interface ProjectSearchParams {
  keyword?: string;
  domain?: ProjectDomainEnum;
  techStack?: TechStackEnum;
  projectType?: ProjectTypeEnum;
  sdgGoal?: SDGGoalEnum;
  status?: ProjectStatusEnum;
  featuredOnly?: boolean;
  limit?: number;
}

// Only ever return content that has passed moderation. Never leak PENDING/REJECTED
// projects or internal fields (team emails/phones) to the public-facing chatbot.
export async function searchProjects(params: ProjectSearchParams) {
  const {
    keyword,
    domain,
    techStack,
    projectType,
    sdgGoal,
    status,
    featuredOnly,
    limit = 5,
  } = params;

  const associationFilters: Record<string, unknown>[] = [];
  if (domain) associationFilters.push({ type: "PROJECT_DOMAIN", domain });
  if (techStack) associationFilters.push({ type: "PROJECT_TECH", techStack });
  if (projectType) associationFilters.push({ type: "PROJECT_TYPE", projectType });
  if (sdgGoal) associationFilters.push({ type: "PROJECT_SDG", sdgGoal });

  const results = await prisma.projectMetadata.findMany({
    where: {
      ...(featuredOnly ? { featured: true } : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { subtitle: { contains: keyword } },
            ],
          }
        : {}),
      projectContent: {
        status: { approved_status: "APPROVED" },
        ...(status ? { status: { status } } : {}),
        ...(associationFilters.length
          ? {
              AND: associationFilters.map((f) => ({
                associations: { some: f },
              })),
            }
          : {}),
      },
    },
    select: {
      project_id: true,
      title: true,
      subtitle: true,
      website: true,
      cover_image: true,
      featured: true,
      sdgp_year: true,
      projectContent: {
        select: {
          status: { select: { status: true } },
          associations: {
            select: { type: true, domain: true, techStack: true, sdgGoal: true, projectType: true },
          },
          projectDetails: {
            select: { problem_statement: true, solution: true, features: true },
          },
        },
      },
    },
    take: Math.min(limit, 10),
    orderBy: { featured: "desc" },
  });

  // Flatten into a compact shape — keeps the token cost of tool_result low
  // and strips anything not meant for public consumption (no team_email/phone).
  return results.map((p) => ({
    id: p.project_id,
    title: p.title,
    subtitle: p.subtitle,
    website: p.website,
    year: p.sdgp_year,
    featured: p.featured,
    status: p.projectContent?.status?.status ?? null,
    domains: p.projectContent?.associations
      .filter((a) => a.type === "PROJECT_DOMAIN")
      .map((a) => a.domain),
    techStack: p.projectContent?.associations
      .filter((a) => a.type === "PROJECT_TECH")
      .map((a) => a.techStack),
    sdgGoals: p.projectContent?.associations
      .filter((a) => a.type === "PROJECT_SDG")
      .map((a) => a.sdgGoal),
    solution: p.projectContent?.projectDetails?.solution ?? null,
    features: p.projectContent?.projectDetails?.features ?? null,
  }));
}