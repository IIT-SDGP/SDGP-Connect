import { ProjectSubmissionSchema } from "@/validations/submit_project";
import { getModuleFromYear } from "@/lib/utils/module";
import {
  AssociationType,
  ProjectStatusEnum,
  ProjectApprovalStatus,
  ProjectDomainEnum,
  ProjectTypeEnum,
  SDGGoalEnum,
  TechStackEnum,
} from "@/types/prisma-types";

export type ProjectEditChange = {
  path: string;
  from: unknown;
  to: unknown;
};

export type NormalizedProjectSnapshot = ProjectSubmissionSchema & {
  // Ensure arrays are always present after normalization.
  sdgGoals: string[];
  domains: string[];
  projectTypes: string[];
  techStack: string[];
  team: Array<{
    name: string;
    linkedin_url?: string;
    profile_image?: string | null;
  }>;
  socialLinks: Array<{
    link_name: string;
    url: string;
  }>;
  slides: Array<{
    slides_content: string;
  }>;
};

export function splitTeamPhone(teamPhone: string): { country_code: string; phone_number: string } {
  const trimmed = teamPhone?.trim() ?? "";
  if (!trimmed) return { country_code: "+94", phone_number: "" };
  if (!trimmed.startsWith("+")) return { country_code: "+94", phone_number: trimmed };

  const digits = trimmed.slice(1); // remove '+'
  // Country codes can be 1-4 digits based on your validation schema.
  for (let len = 1; len <= 4; len++) {
    const cc = `+${digits.slice(0, len)}`;
    const pn = digits.slice(len);
    if (/^\d+$/.test(pn) && pn.length >= 1 && pn.length <= 10) {
      return { country_code: cc, phone_number: pn };
    }
  }

  // Fallback: assume +94 (matches your UI default) and best-effort remainder.
  return { country_code: "+94", phone_number: digits.length > 2 ? digits.slice(2) : digits };
}

export function normalizeSnapshotForStorage(
  snapshot: ProjectSubmissionSchema
): NormalizedProjectSnapshot {
  const sdgGoals = [...(snapshot.sdgGoals ?? [])].sort();
  const domains = [...snapshot.domains].sort();
  const projectTypes = [...snapshot.projectTypes].sort();
  const techStack = [...snapshot.techStack].sort();

  const socialLinks = [...(snapshot.socialLinks ?? [])].sort((a, b) => {
    const byPlatform = (a.link_name ?? "").localeCompare(b.link_name ?? "");
    if (byPlatform !== 0) return byPlatform;
    return (a.url ?? "").localeCompare(b.url ?? "");
  });

  const team = [...snapshot.team].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

  // Slides order matters; do not sort.
  const slides = [...snapshot.slides];

  const normalized: NormalizedProjectSnapshot = {
    ...snapshot,
    // Ensure module is consistent with the (read-only) year.
    metadata: {
      ...snapshot.metadata,
      module: snapshot.metadata?.sdgp_year
        ? getModuleFromYear(snapshot.metadata.sdgp_year)
        : snapshot.metadata?.module,
    },
    sdgGoals,
    domains,
    projectTypes,
    techStack,
    team: team.map((m) => ({
      name: m.name,
      linkedin_url: m.linkedin_url ?? undefined,
      profile_image: m.profile_image ?? null,
    })),
    socialLinks: socialLinks.map((s) => ({
      link_name: s.link_name,
      url: s.url,
    })),
    slides,
  };

  return normalized;
}

function arraysEqualShallow(a: unknown[], b: unknown[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function computeSnapshotChanges(
  liveSnapshot: NormalizedProjectSnapshot,
  draftSnapshot: NormalizedProjectSnapshot
): ProjectEditChange[] {
  const changes: ProjectEditChange[] = [];

  const pushIfChanged = (path: string, from: unknown, to: unknown) => {
    if (JSON.stringify(from) === JSON.stringify(to)) return;
    changes.push({ path, from, to });
  };

  // Metadata primitives
  pushIfChanged("metadata.title", liveSnapshot.metadata.title, draftSnapshot.metadata.title);
  pushIfChanged("metadata.subtitle", liveSnapshot.metadata.subtitle ?? null, draftSnapshot.metadata.subtitle ?? null);
  pushIfChanged("metadata.website", liveSnapshot.metadata.website ?? null, draftSnapshot.metadata.website ?? null);
  pushIfChanged("metadata.cover_image", liveSnapshot.metadata.cover_image ?? null, draftSnapshot.metadata.cover_image ?? null);
  pushIfChanged("metadata.logo", liveSnapshot.metadata.logo ?? null, draftSnapshot.metadata.logo ?? null);

  // Project details primitives
  pushIfChanged(
    "projectDetails.problem_statement",
    liveSnapshot.projectDetails.problem_statement,
    draftSnapshot.projectDetails.problem_statement
  );
  pushIfChanged(
    "projectDetails.solution",
    liveSnapshot.projectDetails.solution,
    draftSnapshot.projectDetails.solution
  );
  pushIfChanged(
    "projectDetails.features",
    liveSnapshot.projectDetails.features,
    draftSnapshot.projectDetails.features
  );
  pushIfChanged(
    "projectDetails.team_email",
    liveSnapshot.projectDetails.team_email,
    draftSnapshot.projectDetails.team_email
  );

  // Normalize phone fields together
  pushIfChanged(
    "projectDetails.team_phone",
    liveSnapshot.projectDetails.team_phone ?? "",
    draftSnapshot.projectDetails.team_phone ?? ""
  );

  // Status
  pushIfChanged("status.status", liveSnapshot.status.status, draftSnapshot.status.status);

  // Arrays of primitives (stored sorted)
  if (!arraysEqualShallow(liveSnapshot.domains, draftSnapshot.domains)) {
    changes.push({ path: "domains", from: liveSnapshot.domains, to: draftSnapshot.domains });
  }
  if (!arraysEqualShallow(liveSnapshot.projectTypes, draftSnapshot.projectTypes)) {
    changes.push({ path: "projectTypes", from: liveSnapshot.projectTypes, to: draftSnapshot.projectTypes });
  }
  if (!arraysEqualShallow(liveSnapshot.sdgGoals, draftSnapshot.sdgGoals)) {
    changes.push({ path: "sdgGoals", from: liveSnapshot.sdgGoals, to: draftSnapshot.sdgGoals });
  }
  if (!arraysEqualShallow(liveSnapshot.techStack, draftSnapshot.techStack)) {
    changes.push({ path: "techStack", from: liveSnapshot.techStack, to: draftSnapshot.techStack });
  }

  // Team (stored sorted by name, index-based diff)
  if (liveSnapshot.team.length !== draftSnapshot.team.length) {
    changes.push({ path: "team", from: liveSnapshot.team, to: draftSnapshot.team });
  }
  const teamLen = Math.max(liveSnapshot.team.length, draftSnapshot.team.length);
  for (let i = 0; i < teamLen; i++) {
    const l = liveSnapshot.team[i];
    const d = draftSnapshot.team[i];
    if (!l || !d) continue;
    pushIfChanged(`team[${i}].name`, l.name, d.name);
    pushIfChanged(`team[${i}].linkedin_url`, l.linkedin_url ?? null, d.linkedin_url ?? null);
    pushIfChanged(`team[${i}].profile_image`, l.profile_image ?? null, d.profile_image ?? null);
  }

  // Social links (stored sorted by link_name, then url)
  if (liveSnapshot.socialLinks.length !== draftSnapshot.socialLinks.length) {
    changes.push({ path: "socialLinks", from: liveSnapshot.socialLinks, to: draftSnapshot.socialLinks });
  }
  const socialLen = Math.max(liveSnapshot.socialLinks.length, draftSnapshot.socialLinks.length);
  for (let i = 0; i < socialLen; i++) {
    const l = liveSnapshot.socialLinks[i];
    const d = draftSnapshot.socialLinks[i];
    if (!l || !d) continue;
    pushIfChanged(`socialLinks[${i}].link_name`, l.link_name, d.link_name);
    pushIfChanged(`socialLinks[${i}].url`, l.url, d.url);
  }

  // Slides (preserve original index order)
  if (liveSnapshot.slides.length !== draftSnapshot.slides.length) {
    changes.push({ path: "slides", from: liveSnapshot.slides, to: draftSnapshot.slides });
  }
  const slidesLen = Math.max(liveSnapshot.slides.length, draftSnapshot.slides.length);
  for (let i = 0; i < slidesLen; i++) {
    const l = liveSnapshot.slides[i];
    const d = draftSnapshot.slides[i];
    if (!l || !d) continue;
    pushIfChanged(`slides[${i}].slides_content`, l.slides_content, d.slides_content);
  }

  return changes;
}

export function isProjectApproved(approvedStatus: ProjectApprovalStatus) {
  return approvedStatus === ProjectApprovalStatus.APPROVED;
}

export function buildLiveSnapshotFromDb(input: {
  metadata: {
    sdgp_year: string;
    group_num: string;
    title: string;
    subtitle: string | null;
    website: string | null;
    cover_image: string | null;
    logo: string | null;
  };
  status: { status: ProjectStatusEnum } | null;
  projectDetails: {
    problem_statement: string;
    solution: string;
    features: string;
    team_email: string;
    team_phone: string;
  } | null;
  associations: Array<{
    type: AssociationType;
    domain?: string | null;
    projectType?: string | null;
    sdgGoal?: string | null;
    techStack?: string | null;
  }>;
  team: Array<{
    name: string;
    linkedin_url: string | null;
    profile_image: string | null;
  }>;
  socialLinks: Array<{
    link_name: string;
    url: string;
  }>;
  slides: Array<{
    slides_content: string;
  }>;
}): ProjectSubmissionSchema {
  const phoneSplit = splitTeamPhone(input.projectDetails?.team_phone ?? "");

  const domains = input.associations
    .filter((a) => a.type === AssociationType.PROJECT_DOMAIN && a.domain)
    .map((a) => a.domain as ProjectDomainEnum);

  const projectTypes = input.associations
    .filter((a) => a.type === AssociationType.PROJECT_TYPE && a.projectType)
    .map((a) => a.projectType as ProjectTypeEnum);

  const sdgGoals = input.associations
    .filter((a) => a.type === AssociationType.PROJECT_SDG && a.sdgGoal)
    .map((a) => a.sdgGoal as SDGGoalEnum);

  const techStack = input.associations
    .filter((a) => a.type === AssociationType.PROJECT_TECH && a.techStack)
    .map((a) => a.techStack as TechStackEnum);

  const statusEnum = input.status?.status ?? ProjectStatusEnum.IDEA;

  return {
    metadata: {
      sdgp_year: input.metadata.sdgp_year,
      group_num: input.metadata.group_num,
      title: input.metadata.title,
      subtitle: input.metadata.subtitle ?? null,
      website: input.metadata.website ?? null,
      cover_image: input.metadata.cover_image ?? "",
      logo: input.metadata.logo ?? "",
      module: getModuleFromYear(input.metadata.sdgp_year),
    },
    projectDetails: {
      problem_statement: input.projectDetails?.problem_statement ?? "",
      solution: input.projectDetails?.solution ?? "",
      features: input.projectDetails?.features ?? "",
      team_email: input.projectDetails?.team_email ?? "",
      // Keep `team_phone` for storage (matches your submit API).
      team_phone: input.projectDetails?.team_phone ?? "",
      // These are required by zod schema, but can be derived from team_phone.
      country_code: phoneSplit.country_code,
      phone_number: phoneSplit.phone_number,
    },
    status: {
      status: statusEnum,
    },
    domains,
    projectTypes,
    sdgGoals,
    techStack,
    team: input.team.map((m) => ({
      name: m.name,
      linkedin_url: m.linkedin_url ?? "",
      profile_image: m.profile_image ?? null,
    })),
    socialLinks: input.socialLinks.map((s) => ({
      link_name: s.link_name as any,
      url: s.url,
    })),
    slides: input.slides.map((sl) => ({
      slides_content: sl.slides_content,
    })),
  };
}