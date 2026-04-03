import { prisma } from '@/prisma/prismaClient';
import { projectSubmissionSchema } from '@/validations/submit_project';
import { AssociationType, ProjectApprovalStatus, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getModuleFromYear } from '@/lib/utils/module';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

function isPrivateIpv4(ip: string) {
  const match = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const parts = match.slice(1).map((p) => Number(p));
  if (parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return false;

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function normalizeAndValidateWebsiteUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid website URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Invalid website URL");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (hostname === "localhost" || hostname === "::1") {
    throw new Error("Invalid website URL");
  }
  if (isPrivateIpv4(hostname)) {
    throw new Error("Invalid website URL");
  }

  // Normalizes IDNs (e.g. loomeé.com) to punycode via WHATWG URL.
  return parsed.toString();
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({});

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');  // Cache the CORS preflight response for 24 hours

  // Return a 200 status for OPTIONS
  return response;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      const res = NextResponse.json(
        { success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Max-Age', '86400');
      return res;
    }

    const role = (session.user as any).role as string | undefined;
    const userId = (session.user as any).id as string | undefined;
    if (!userId) {
      const res = NextResponse.json(
        { success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Max-Age', '86400');
      return res;
    }

    if (role !== 'STUDENT') {
      const res = NextResponse.json(
        { success: false, message: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      );
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Max-Age', '86400');
      return res;
    }

    // Parse the request body
    const body = await request.json();

    // Validate the submission data
    const validatedData = projectSubmissionSchema.parse(body);

    // Validate website field to prevent unsafe schemes
    try {
      const normalizedWebsite = normalizeAndValidateWebsiteUrl(
        validatedData?.metadata?.website ?? ""
      );
      validatedData.metadata.website = normalizedWebsite;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid website URL",
          code: "INVALID_WEBSITE_URL",
          details: "Website URL must be a valid http(s) address.",
        },
        { status: 400 }
      );
    }

    // Automatically set the module field based on selected year
    if (validatedData.metadata?.sdgp_year) {
      validatedData.metadata.module = getModuleFromYear(validatedData.metadata.sdgp_year);
    }

    // Prevent new project submissions while the student has a locked project.
    // This is what displays the "edit locked" behavior for PENDING/REJECTED.
    const lockedProjectContent = (await prisma.projectContent.findFirst({
      where: {
        // Prisma typings for nested relation filters can be finicky during schema changes;
        // cast to `any` to keep the logic correct and unblock compilation.
        metadata: { owner_userId: userId } as any,
        status: {
          approved_status: {
            in: [ProjectApprovalStatus.PENDING, ProjectApprovalStatus.REJECTED],
          },
        },
      },
      include: {
        metadata: true,
        status: true,
      },
    })) as any;

    if (lockedProjectContent?.metadata && lockedProjectContent.status) {
      const res = NextResponse.json(
        {
          success: false,
          message: 'Edit locked for your project',
          code: 'EDIT_LOCKED',
          details: `Your project is currently ${lockedProjectContent.status.approved_status}. You cannot submit a new project until an admin re-opens it (approves it).`,
          data: {
            projectId: lockedProjectContent.metadata.project_id,
            status: lockedProjectContent.status.approved_status,
          },
        },
        { status: 409 }
      );
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Max-Age', '86400');
      return res;
    }

    // Start a transaction to ensure all database operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create ProjectMetadata - This has our main project_id
      const projectMetadata = await tx.projectMetadata.create({
        data: {
          sdgp_year: validatedData.metadata.sdgp_year,
          group_num: validatedData.metadata.group_num,
          title: validatedData.metadata.title,
          subtitle: validatedData.metadata.subtitle || null,
          website: validatedData.metadata.website || null,
          cover_image: validatedData.metadata.cover_image || null,
          logo: validatedData.metadata.logo || null,
          featured: false,
          module: validatedData.metadata.module,
          owner_userId: userId,
        } as any
      });



      // 2. Create ProjectContent - This links to ProjectMetadata via project_id
      const projectContent = await tx.projectContent.create({
        data: {
          metadata_id: projectMetadata.project_id // Link to the main project_id
        }
      });


      // 3. Create ProjectDetails - Links to ProjectContent via content_id
      await tx.projectDetails.create({
        data: {
          content: { connect: { content_id: projectContent.content_id } },
          problem_statement: validatedData.projectDetails.problem_statement,
          solution: validatedData.projectDetails.solution,
          features: validatedData.projectDetails.features,
          team_email: validatedData.projectDetails.team_email,
          team_phone: validatedData.projectDetails.team_phone || '',
        }
      });

      // 4. Create ProjectStatus - Links to ProjectContent via content_id
      await tx.projectStatus.create({
        data: {
          content_id: projectContent.content_id, // Using content_id as primary key
          status: validatedData.status.status,
          approved_status: ProjectApprovalStatus.PENDING
        }
      });

      // Domain associations
      const createDomainAssociations = validatedData.domains.map(domain => {
        return tx.projectAssociation.create({
          data: {
            content: { connect: { content_id: projectContent.content_id } },
            type: AssociationType.PROJECT_DOMAIN,
            domain: domain,
            value: domain
          }
        });
      });

      // Project type associations
      const createProjectTypeAssociations = validatedData.projectTypes.map(projectType => {
        return tx.projectAssociation.create({
          data: {
            content: { connect: { content_id: projectContent.content_id } },
            type: AssociationType.PROJECT_TYPE,
            projectType: projectType,
            value: projectType
          }
        });
      });

      // SDG associations (if present)
      const createSdgAssociations = validatedData.sdgGoals?.map(sdgGoal => {
        return tx.projectAssociation.create({
          data: {
            content: { connect: { content_id: projectContent.content_id } },
            type: AssociationType.PROJECT_SDG,
            sdgGoal: sdgGoal,
            value: sdgGoal
          }
        });
      }) || [];  // Handle case where sdgGoals might be undefined

      // Tech stack associations
      const createTechAssociations = validatedData.techStack.map(tech => {
        return tx.projectAssociation.create({
          data: {
            content: { connect: { content_id: projectContent.content_id } },
            type: AssociationType.PROJECT_TECH,
            techStack: tech,
            value: tech
          }
        });
      });

      // Combine all associations into a single array of promises
      const allAssociations = [
        ...createDomainAssociations,
        ...createProjectTypeAssociations,
        ...createSdgAssociations,
        ...createTechAssociations
      ];

      // Wait for all association creations to complete
      await Promise.all(allAssociations);


      // 6. Create Team Members - Link to ProjectContent via content_id
      if (validatedData.team && validatedData.team.length > 0) {
        for (const member of validatedData.team) {
          await tx.projectTeam.create({
            data: {
              content: { connect: { content_id: projectContent.content_id } },
              name: member.name,
              linkedin_url: member.linkedin_url || null,
              profile_image: member.profile_image || null,
            }
          });
        }
      }

      // 7. Create Social Links - Link to ProjectContent via content_id
      if (validatedData.socialLinks && validatedData.socialLinks.length > 0) {
        for (const link of validatedData.socialLinks) {
          await tx.projectSocialLink.create({
            data: {
              content: { connect: { content_id: projectContent.content_id } },
              link_name: link.link_name,
              url: link.url,
            }
          });
        }
      }

      // 8. Create Slides - Link to ProjectContent via content_id
      if (validatedData.slides && validatedData.slides.length > 0) {
        for (const slide of validatedData.slides) {
          await tx.projectSlide.create({
            data: {
              content: { connect: { content_id: projectContent.content_id } },
              slides_content: typeof slide.slides_content === 'string'
                ? slide.slides_content.substring(0, 65535)
                : JSON.stringify(slide.slides_content).substring(0, 65535),
            }
          });
        }
      }

      return {
        projectId: projectMetadata.project_id,
        contentId: projectContent.content_id
      };
    },
      { timeout: 60000 }
    );

    // Revalidate the projects paths to update the cache
    revalidatePath('/project');
    revalidatePath('/(public)/project');

    // Return success response with CORS headers
    const response = NextResponse.json({
      success: true,
      message: 'Project submitted successfully',
      data: {
        projectId: result.projectId
      }
    });

    // Set the CORS headers for both success response and preflight response
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');  // Cache the CORS preflight response for 24 hours

    return response;

  } catch (error: any) {
    console.error('Error submitting project:', error);
    if (error.cause) console.error('Cause:', error.cause);
    if (error.stack) console.error('Stack:', error.stack);

    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        code: "VALIDATION_ERROR",
        errors: error.errors
      }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2000") {
        const column = (error.meta as any)?.column_name || (error.meta as any)?.column || "unknown";
        return NextResponse.json(
          {
            success: false,
            message: "Some input is too long",
            code: "VALUE_TOO_LONG",
            details: `One of the fields exceeded the allowed length (column: ${String(column)}). Please shorten it and try again.`,
          },
          { status: 400 }
        );
      }

      if (error.code === "P2002") {
        const target = (error.meta as any)?.target;
        return NextResponse.json(
          {
            success: false,
            message: "Duplicate submission",
            code: "DUPLICATE",
            details: target
              ? `A record with the same value already exists (${String(target)}).`
              : "A record with the same value already exists.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Database error",
          code: "DB_ERROR",
          details: `Request failed (${error.code}). Please try again.`,
        },
        { status: 500 }
      );
    }

    // Return error response with CORS headers
    const response = NextResponse.json({
      success: false,
      message: 'Failed to submit project',
      code: "SUBMISSION_FAILED",
      details: error.message || 'Unknown error occurred'
    }, { status: 500 });

    // Set the CORS headers for the error response as well
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }
}