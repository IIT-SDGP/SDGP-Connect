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

export interface ProjectSearchSummary {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  pageUrl: string;
  featured: boolean;
  domains: (ProjectDomainEnum | null | undefined)[] | undefined;
  techStack: (TechStackEnum | null | undefined)[] | undefined;
  sdgGoals: (SDGGoalEnum | null | undefined)[] | undefined;
}

export interface ProjectSearchResponse {
  results: ProjectSearchSummary[];
  totalCount: number;
  // Link to the full filtered list on the /projects page, or null when
  // everything that matched is already in `results`.
  showMoreUrl: string | null;
}

const HARD_FETCH_CAP = 100;
const DESCRIPTION_MAX_LENGTH = 300;
// Chat previews are capped at 3 regardless of what the model requests —
// anything beyond that belongs on the /projects page via showMoreUrl.
const PREVIEW_LIMIT = 3;

// Light suffix stripping so morphological variants share a stem and substring
// matching connects them, e.g. "dyslexia" and "Dyslexic" both reduce to
// "dyslex". Longest suffixes first; only strip when a usable stem remains.
const STEM_SUFFIXES = [
  "ations", "ation", "ility", "ities", "ingly", "ing",
  "ical", "ies", "ers", "es", "ed", "er", "ic", "ia", "al", "ly", "s",
];

function stemToken(token: string): string {
  for (const suffix of STEM_SUFFIXES) {
    if (token.endsWith(suffix) && token.length - suffix.length >= 3) {
      return token.slice(0, token.length - suffix.length);
    }
  }
  return token;
}

function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function keywordStems(keyword: string): string[] {
  const tokens = normalizeText(keyword)
    .split(" ")
    .filter((t) => t.length >= 2);
  return Array.from(new Set(tokens.map(stemToken)));
}

// Stems of 4+ chars are distinctive enough for plain substring matching;
// shorter ones ("ai", "app") only count at a word start, so "ai" doesn't
// match "domain".
function stemMatches(stem: string, normalizedText: string): boolean {
  if (stem.length >= 4) return normalizedText.includes(stem);
  return new RegExp(`\\b${stem}`).test(normalizedText);
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max).trimEnd()}…` : s;
}

// Mirrors the query param names read by the /projects page
// (ProjectQueryParams in useGetProjects / FilterSidebar's FilterState).
function buildShowMoreUrl(params: ProjectSearchParams): string {
  const qs = new URLSearchParams();
  if (params.keyword) qs.append("title", params.keyword);
  if (params.featuredOnly) qs.append("featured", "true");
  if (params.status) qs.append("status", params.status);
  if (params.domain) qs.append("domains", params.domain);
  if (params.techStack) qs.append("techStack", params.techStack);
  if (params.projectType) qs.append("projectTypes", params.projectType);
  if (params.sdgGoal) qs.append("sdgGoals", params.sdgGoal);

  const query = qs.toString();
  return query ? `/project?${query}` : "/project";
}

export async function searchProjects(
  params: ProjectSearchParams | null | undefined
): Promise<ProjectSearchResponse> {
  const {
    keyword,
    domain,
    techStack,
    projectType,
    sdgGoal,
    status,
    featuredOnly,
    limit = PREVIEW_LIMIT,
  } = params ?? {};

  const rawLimit = Number.isFinite(limit) ? Math.floor(limit as number) : PREVIEW_LIMIT;
  const take = Math.min(Math.max(rawLimit, 1), PREVIEW_LIMIT);

  const associationFilters: Record<string, unknown>[] = [];
  if (domain) associationFilters.push({ type: "PROJECT_DOMAIN", domain });
  if (techStack) associationFilters.push({ type: "PROJECT_TECH", techStack });
  if (projectType) associationFilters.push({ type: "PROJECT_TYPE", projectType });
  if (sdgGoal) associationFilters.push({ type: "PROJECT_SDG", sdgGoal });

  const stems = keyword ? keywordStems(keyword) : [];

  const candidates = await prisma.projectMetadata.findMany({
    where: {
      ...(featuredOnly ? { featured: true } : {}),
      ...(stems.length
        ? {
            OR: stems.flatMap((stem) => [
              { title: { contains: stem } },
              { subtitle: { contains: stem } },
              { projectContent: { projectDetails: { problem_statement: { contains: stem } } } },
              { projectContent: { projectDetails: { solution: { contains: stem } } } },
              { projectContent: { projectDetails: { features: { contains: stem } } } },
            ]),
          }
        : {}),
      projectContent: {
        status: {
          approved_status: "APPROVED",
          ...(status ? { status } : {}),
        },
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
          projectDetails: {
            select: { problem_statement: true, solution: true, features: true },
          },
          associations: {
            select: { type: true, domain: true, techStack: true, sdgGoal: true, projectType: true },
          },
        },
      },
    },
    orderBy: [{ featured: "desc" }, { project_id: "asc" }],
    take: HARD_FETCH_CAP,
  });

  // Title/subtitle hits are weighted well above description hits so that a
  // project literally named after the keyword outranks featured projects that
  // merely mention it (or contain it inside a longer word) in their text.
  const scored = candidates.map((p) => {
    const details = p.projectContent?.projectDetails;
    const titleText = normalizeText([p.title, p.subtitle].filter(Boolean).join(" "));
    const descText = normalizeText(
      [details?.problem_statement, details?.solution, details?.features]
        .filter(Boolean)
        .join(" ")
    );
    let score = 0;
    for (const stem of stems) {
      if (stemMatches(stem, titleText)) score += 3;
      else if (stemMatches(stem, descText)) score += 1;
    }
    return { project: p, score };
  });

  const filtered = stems.length ? scored.filter((s) => s.score > 0) : scored;

  const sorted = filtered.sort(
    (a, b) =>
      b.score - a.score ||
      Number(b.project.featured) - Number(a.project.featured) ||
      a.project.project_id.localeCompare(b.project.project_id)
  );

  const totalCount = sorted.length;
  const page = sorted.slice(0, take);

  const results = page.map(({ project: p }) => {
    const details = p.projectContent?.projectDetails;
    const description = [details?.problem_statement, details?.solution]
      .filter(Boolean)
      .join(" — ");
    return {
      id: p.project_id,
      title: p.title,
      subtitle: p.subtitle,
      description: description ? truncate(description, DESCRIPTION_MAX_LENGTH) : null,
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
    };
  });

  return {
    results,
    totalCount,
    showMoreUrl: totalCount > results.length ? buildShowMoreUrl(params ?? {}) : null,
  };
}