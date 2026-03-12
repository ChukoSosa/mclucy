import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/server/prisma";
import { ApiError, apiErrorResponse } from "@/app/api/server/api-error";

const ALLOWED_STATUS = ["TODO", "DOING", "DONE", "BLOCKED"] as const;

type SubtaskStatus = (typeof ALLOWED_STATUS)[number];

function normalizeStatus(value: unknown): SubtaskStatus {
  if (typeof value !== "string") {
    throw new ApiError(400, "VALIDATION_ERROR", "status must be a string");
  }

  const normalized = value.trim().toUpperCase();
  if (!ALLOWED_STATUS.includes(normalized as SubtaskStatus)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid subtask status");
  }

  return normalized as SubtaskStatus;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const subtaskId = typeof id === "string" ? id.trim() : "";

    if (!subtaskId) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid subtask id");
    }

    const existing = await prisma.subtask.findUnique({
      where: { id: subtaskId },
      select: { id: true },
    });

    if (!existing) {
      throw new ApiError(404, "NOT_FOUND", "Subtask not found");
    }

    const body = (await request.json()) as Record<string, unknown>;

    const hasStatus = Object.prototype.hasOwnProperty.call(body, "status");
    const hasOwner =
      Object.prototype.hasOwnProperty.call(body, "owner") ||
      Object.prototype.hasOwnProperty.call(body, "ownerAgentId");

    if (!hasStatus && !hasOwner) {
      throw new ApiError(400, "VALIDATION_ERROR", "Provide at least one field to update: status or owner");
    }

    const nextStatus = hasStatus ? normalizeStatus(body.status) : undefined;

    let nextOwnerAgentId: string | null | undefined;
    if (hasOwner) {
      const rawOwner = Object.prototype.hasOwnProperty.call(body, "owner") ? body.owner : body.ownerAgentId;

      if (rawOwner === null) {
        nextOwnerAgentId = null;
      } else if (typeof rawOwner === "string") {
        const ownerId = rawOwner.trim();
        if (!ownerId) {
          throw new ApiError(400, "VALIDATION_ERROR", "owner must be a non-empty string or null");
        }

        const agent = await prisma.agent.findUnique({
          where: { id: ownerId },
          select: { id: true },
        });

        if (!agent) {
          throw new ApiError(404, "NOT_FOUND", "Owner agent not found");
        }

        nextOwnerAgentId = ownerId;
      } else {
        throw new ApiError(400, "VALIDATION_ERROR", "owner must be a string or null");
      }
    }

    const updated = await prisma.subtask.update({
      where: { id: subtaskId },
      data: {
        status: nextStatus,
        ownerAgentId: nextOwnerAgentId,
      },
      include: {
        ownerAgent: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
