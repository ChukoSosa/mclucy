import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/server/prisma";
import { apiErrorResponse } from "@/app/api/server/api-error";

function clampLimit(value: string | null, fallback = 50) {
  const n = value ? Number.parseInt(value, 10) : fallback;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(n, 200));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const limit = clampLimit(request.nextUrl.searchParams.get("limit"), 50);

    const comments = await prisma.taskComment.findMany({
      where: { taskId: params.id },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    const openCount = comments.filter((comment: (typeof comments)[number]) => {
      return !comment.resolvedAt && (comment.status ?? "open") !== "resolved";
    }).length;

    return NextResponse.json({
      comments,
      nextCursor: null,
      openCount,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
