import { NextResponse } from "next/server";
import { prisma } from "@/app/api/server/prisma";
import { apiErrorResponse } from "@/app/api/server/api-error";

export async function GET() {
  try {
    const pipelines = await prisma.pipeline.findMany({
      include: {
        stages: {
          orderBy: { position: "asc" },
          include: {
            tasks: {
              where: { archivedAt: null },
              include: { assignedAgent: { select: { id: true, name: true } } },
              orderBy: { updatedAt: "desc" },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ pipelines });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
