/**
 * GET /api/comments/changes?since=<ISO>&limit=<n>
 *
 * Delta endpoint for the OpenClaw comment-listener polling fallback.
 * Returns all human-authored task comments created after `since`,
 * ordered oldest-first, plus a `latestCursor` the caller should
 * persist as the next `since` value.
 *
 * Used when the SSE connection to /api/events is unavailable or
 * the listener has just restarted and needs to catch up on missed events.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/server/prisma";
import { apiErrorResponse } from "@/app/api/server/api-error";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const sinceRaw = params.get("since");
    const limit = Math.max(1, Math.min(Number(params.get("limit") ?? "50"), 200));

    const since = sinceRaw ? new Date(sinceRaw) : new Date(0);
    if (isNaN(since.getTime())) {
      return NextResponse.json({ error: "Invalid 'since' timestamp" }, { status: 400 });
    }

    const comments = await prisma.taskComment.findMany({
      where: {
        createdAt: { gt: since },
        // Only return human comments — agent/system replies are not actionable
        authorType: "human",
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            status: true,
            assignedAgentId: true,
          },
        },
      },
    });

    const latestCursor =
      comments.at(-1)?.createdAt?.toISOString() ?? sinceRaw ?? new Date(0).toISOString();

    return NextResponse.json({
      comments,
      latestCursor,
      count: comments.length,
      hasMore: comments.length === limit,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
