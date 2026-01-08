// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import { ProjectApprovalStatus } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    // --- Pagination ---
    const page  = Math.max(parseInt(searchParams.get("page")  || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "9", 10), 1);
    const skip  = (page - 1) * limit;

    // --- Filters from URL ---
    const title        = searchParams.get("title")    || "";
    const years        = searchParams.getAll("years");
    const statusValues = searchParams.getAll("status");
    const projectTypes = searchParams.getAll("projectTypes");
    const domains      = searchParams.getAll("domains");
    const sdgGoals     = searchParams.getAll("sdgGoals");
    const techStack    = searchParams.getAll("techStack");

    // --- Build baseWhere (common to both count & find) ---
    const baseWhere: any = {};

    // Year filter
    if (years.length) {
      baseWhere.sdgp_year = { in: years };
    }

    // Status filter
    const projectStatusValues = statusValues.filter(s =>
      ["IDEA","MVP","DEPLOYED","STARTUP","RESEARCH"].includes(s.toUpperCase())
    );
    const approvalStatusValues = statusValues.filter(s =>
      ["APPROVED","PENDING","REJECTED"].includes(s.toUpperCase())
    );

    baseWhere.projectContent = { status: {} };
    if (projectStatusValues.length) {
      baseWhere.projectContent.status.status = { in: projectStatusValues };
    }
    if (approvalStatusValues.length) {
      baseWhere.projectContent.status.approved_status = { in: approvalStatusValues };
    } else {
      baseWhere.projectContent.status.approved_status = ProjectApprovalStatus.APPROVED;
    }

    // Association filters
    const assocFilters: any[] = [];
    if (projectTypes.length) assocFilters.push({ type: "PROJECT_TYPE",   projectType: { in: projectTypes } });
    if (domains.length)      assocFilters.push({ type: "PROJECT_DOMAIN", domain: { in: domains } });
    if (sdgGoals.length)     assocFilters.push({ type: "PROJECT_SDG",    sdgGoal: { in: sdgGoals } });
    if (techStack.length)    assocFilters.push({ type: "PROJECT_TECH",   techStack: { in: techStack } });

    if (assocFilters.length) {
      baseWhere.projectContent.associations = { some: { OR: assocFilters } };
    }

    // --- titleFilter (no `mode`) ---
    const titleFilter = title
      ? [
          { title:    { contains: title } },
        ]
      : [];

    // --- countWhere & findManyWhere ---
    const countWhere = {
      ...baseWhere,
      ...(title ? { OR: titleFilter } : {})
    };
    const findManyWhere = { ...countWhere }; // identical since no mode

    // --- Query total & paginated data ---
    const totalProjects = await prisma.projectMetadata.count({ where: countWhere });
    const totalPages    = Math.ceil(totalProjects / limit);

    const projects = await prisma.projectMetadata.findMany({
      where:   findManyWhere,
      take:    limit,
      skip,
      orderBy: { updatedAt: "desc" },
      select: {
        project_id: true,
        title:      true,
        subtitle:   true,
        cover_image:true,
        sdgp_year:  true,
        projectContent: {
          select: {
            status: {
              select: { status: true, approved_status: true }
            },
            associations: {
              where: {
                OR: [
                  { type: "PROJECT_TYPE" },
                  { type: "PROJECT_DOMAIN" },
                  { type: "PROJECT_SDG" },
                  { type: "PROJECT_TECH" },
                ]
              },
              select: {
                type:       true,
                projectType:true,
                domain:     true,
                sdgGoal:    true,
                techStack:  true,
              }
            }
          }
        }
      }
    });

    // --- Format response ---
    const formatted = projects.map((p) => {
      const assocs = p?.projectContent?.associations || [];
      return {
        id:          p.project_id,
        title:       p.title,
        subtitle:    p.subtitle || "",
        coverImage:  p.cover_image,
        status:      p?.projectContent?.status?.status,
        approved:    p?.projectContent?.status?.approved_status,
        projectTypes: assocs.filter(a => a.type === "PROJECT_TYPE").map(a => a.projectType),
        domains:      assocs.filter(a => a.type === "PROJECT_DOMAIN").map(a => a.domain),
        year:        p.sdgp_year,
      };
    });

    return NextResponse.json({
      data: formatted,
      meta: {
        currentPage: page,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
};
