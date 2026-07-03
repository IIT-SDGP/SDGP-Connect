// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

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

export async function searchProjects(params: ProjectSearchParams | null | undefined) {
  const {
    keyword,
    domain,
    techStack,
    projectType,
    sdgGoal,
    status,
    featuredOnly,
    limit = 3,
  } = params ?? {};

  const take = Math.min(limit, 8);

  const associationFilters: Record<string, unknown>[] = [];
  if (domain) associationFilters.push({ type: "PROJECT_DOMAIN", domain });
  if (techStack) associationFilters.push({ type: "PROJECT_TECH", techStack });
  if (projectType) associationFilters.push({ type: "PROJECT_TYPE", projectType });
  if (sdgGoal) associationFilters.push({ type: "PROJECT_SDG", sdgGoal });

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedKeyword = keyword ? normalize(keyword) : "";

  const candidates = await prisma.projectMetadata.findMany({
    where: {
      ...(featuredOnly ? { featured: true } : {}),
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
      featured: true,
      sdgp_year: true,
      projectContent: {
        select: {
          status: { select: { status: true } },
          associations: {
            select: { type: true, domain: true, techStack: true, sdgGoal: true, projectType: true },
          },
        },
      },
    },
    orderBy: { featured: "desc" },
  });

  const filtered = normalizedKeyword
    ? candidates.filter(
        (p) =>
          normalize(p.title ?? "").includes(normalizedKeyword) ||
          normalize(p.subtitle ?? "").includes(normalizedKeyword)
      )
    : candidates;

  const results = filtered.slice(0, take);

  return results.map((p) => ({
    id: p.project_id,
    title: p.title,
    subtitle: p.subtitle,
    pageUrl: `/project/${p.project_id}`,
    featured: p.featured,
    domains: p.projectContent?.associations
      .filter((a) => a.type === "PROJECT_DOMAIN")
      .map((a) => a.domain),
    techStack: p.projectContent?.associations
      .filter((a) => a.type === "PROJECT_TECH")
      .map((a) => a.techStack),
    sdgGoals: p.projectContent?.associations
      .filter((a) => a.type === "PROJECT_SDG")
      .map((a) => a.sdgGoal),
  }));
}