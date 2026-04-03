import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    // Await params before accessing properties
    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get the project metadata
    const projectMetadata = await prisma.projectMetadata.findUnique({
      where: {
        project_id: projectId,
      },
    });

    if (!projectMetadata) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get the project content with all related data
    const projectContent = await prisma.projectContent.findUnique({
      where: {
        metadata_id: projectId, // Use metadata_id to find the content associated with this project
      },
      include: {
        projectDetails: true,
        status: {
          include: {
            approved_by: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        associations: true,
        slides: true,
        team: true,
        socialLinks: true,
      },
    });

    // Construct the full project object
    const project = {
      metadata: projectMetadata,
      content: projectContent,
    };

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch project details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}