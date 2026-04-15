import { prisma } from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/types/prisma-types";
import { BlobServiceClient } from "@azure/storage-blob";

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
      return pathParts[1]; // The blob name is the second part
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
  const account = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME;
  const container = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME;
  const sas = process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN;

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

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check user role in DB - only ADMIN can delete projects
  const user = await prisma.user.findUnique({
    where: { user_id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== Role.ADMIN) {
    return NextResponse.json(
      { error: "Forbidden. Only administrators can delete projects." },
      { status: 403 }
    );
  }

  try {
    // Fetch the project with all related data for deletion
    const project = await prisma.projectMetadata.findUnique({
      where: { project_id: projectId },
      include: {
        projectContent: {
          include: {
            projectDetails: true,
            status: true,
            associations: true,
            slides: true,
            team: true,
            socialLinks: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
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
    await prisma.$transaction(async (tx: typeof prisma) => {
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

    // Delete blobs in the background (non-blocking)
    Promise.all(blobsToDelete.map(deleteBlob)).catch((error) => {
      console.error("Error deleting blobs:", error);
    });

    console.log(`Project ${projectId} deleted successfully by user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
