import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectApprovalStatus, AuditAction } from "@/types/prisma-types";
import { BlobServiceClient } from "@azure/storage-blob";
import { createAuditLog } from "@/lib/audit";

/**
 * Extracts the blob name from an Azure Blob Storage URL.
 * URL format: https://{account}.blob.core.windows.net/{container}/{blobName}
 */
function extractBlobName(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    // Path is like /{container}/{blobName}
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2) {
      // Join all parts after the container name to handle virtual folders (e.g., "projects/cover/abc.png")
      return pathParts.slice(1).join('/');
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Deletes a blob from Azure Blob Storage.
 * Fails silently to avoid blocking project deletion.
 */
async function deleteBlob(blobName: string): Promise<void> {
  // Use server-only env vars for sensitive credentials
  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const container = process.env.AZURE_STORAGE_CONTAINER_NAME;
  const sas = process.env.AZURE_SAS_TOKEN;

  if (!account || !container || !sas) {
    console.warn("Azure blob storage not configured, skipping blob deletion");
    return;
  }

  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net/?${sas}`
    );
    const containerClient = blobServiceClient.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  } catch (error) {
    console.error(`Failed to delete blob ${blobName}:`, error);
    // Fail silently - don't block project deletion
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;
  const startTime = Date.now();

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Role-based authorization check - only ADMIN can delete projects
  const { role } = session.user;
  if (role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Only administrators can delete projects." },
      { status: 403 }
    );
  }

  const userId = session.user.id;

  try {
    // Fetch only the fields needed for deletion checks and blob cleanup
    const project = await prisma.projectMetadata.findUnique({
      where: { project_id: projectId },
      select: {
        title: true,
        sdgp_year: true,
        group_num: true,
        cover_image: true,
        logo: true,
        projectContent: {
          select: {
            content_id: true,
            status: {
              select: {
                approved_status: true,
              },
            },
            team: {
              select: {
                profile_image: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only allow deletion of rejected projects
    if (project.projectContent?.status?.approved_status !== ProjectApprovalStatus.REJECTED) {
      return NextResponse.json(
        { error: "Only rejected projects can be deleted" },
        { status: 409 }
      );
    }

    // Collect blob URLs for deletion
    const blobsToDelete: string[] = [];

    // Add cover image and logo
    const coverBlobName = extractBlobName(project.cover_image);
    if (coverBlobName) blobsToDelete.push(coverBlobName);

    const logoBlobName = extractBlobName(project.logo);
    if (logoBlobName) blobsToDelete.push(logoBlobName);

    // Add team member profile images
    if (project.projectContent?.team) {
      for (const member of project.projectContent.team) {
        const profileBlobName = extractBlobName(member.profile_image);
        if (profileBlobName) blobsToDelete.push(profileBlobName);
      }
    }

    // Delete in the correct order due to FK constraints (onDelete: Restrict)
    // All child tables must be deleted before their parent
    await prisma.$transaction(async (tx) => {
      const contentId = project.projectContent?.content_id;

      if (contentId) {
        // Delete ProjectDetails (depends on ProjectContent)
        await tx.projectDetails.deleteMany({
          where: { content_id: contentId },
        });

        // Delete ProjectStatus (depends on ProjectContent)
        await tx.projectStatus.deleteMany({
          where: { content_id: contentId },
        });

        // Delete ProjectAssociation records (depends on ProjectContent)
        await tx.projectAssociation.deleteMany({
          where: { content_id: contentId },
        });

        // Delete ProjectSlide records (depends on ProjectContent)
        await tx.projectSlide.deleteMany({
          where: { content_id: contentId },
        });

        // Delete ProjectTeam records (depends on ProjectContent)
        await tx.projectTeam.deleteMany({
          where: { content_id: contentId },
        });

        // Delete ProjectSocialLink records (depends on ProjectContent)
        await tx.projectSocialLink.deleteMany({
          where: { content_id: contentId },
        });

        // Delete ProjectContent (depends on ProjectMetadata)
        await tx.projectContent.delete({
          where: { content_id: contentId },
        });
      }

      // Delete ProjectMetadata (will cascade delete Awards via relation)
      await tx.projectMetadata.delete({
        where: { project_id: projectId },
      });
    });

    // Attempt blob cleanup before returning so deletion is reliable in serverless runtimes
    // Note: deleteBlob handles errors internally and logs them, so Promise.all won't reject
    await Promise.all(blobsToDelete.map(deleteBlob));

    // Create audit log entry for this deletion
    await createAuditLog({
      action: AuditAction.PROJECT_DELETED,
      userId,
      entityType: "PROJECT",
      entityId: projectId,
      metadata: {
        title: project.title,
        groupNumber: project.group_num,
        sdgpYear: project.sdgp_year,
        blobsDeleted: blobsToDelete.length,
        deletionDurationMs: Date.now() - startTime,
      },
      request: req,
    });

    console.log(`Project ${projectId} deleted successfully by user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project", details: error.message },
      { status: 500 }
    );
  }
}
