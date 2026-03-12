import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/server/prisma";
import { apiErrorResponse } from "@/app/api/server/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const subtasks = await prisma.subtask.findMany({
      where: { taskId: params.id },
      include: {
        ownerAgent: {
          select: { id: true, name: true },
        },
      },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ subtasks });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
