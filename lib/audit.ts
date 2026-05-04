// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { prisma } from "@/prisma/prismaClient";
import { AuditAction, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

interface CreateAuditLogParams {
  action: AuditAction;
  userId: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
  request?: NextRequest;
}

/**
 * Creates an audit log entry for administrative actions.
 * This provides a permanent record of who performed what action and when.
 */
export async function createAuditLog({
  action,
  userId,
  entityType,
  entityId,
  metadata,
  request,
}: CreateAuditLogParams): Promise<void> {
  try {
    const ipAddress = request
      ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        null
      : null;

    const userAgent = request
      ? request.headers.get("user-agent") || null
      : null;

    await prisma.auditLog.create({
      data: {
        action,
        userId,
        entityType,
        entityId,
        metadata: metadata ?? Prisma.JsonNull,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Log the error but don't throw - audit logging should never block the main operation
    console.error("Failed to create audit log:", error);
  }
}
