import { PrismaClient, AgentStatus, TaskStatus, RunStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const operator = await prisma.operator.upsert({
    where: { id: "operator-root" },
    update: {},
    create: {
      id: "operator-root",
      name: "Mission Operator",
      email: "operator@mission.control",
    },
  });

  const [codi, ninja] = await Promise.all([
    prisma.agent.upsert({
      where: { id: "00000000-0000-4000-8000-00000000c0d1" },
      update: {},
      create: {
        id: "00000000-0000-4000-8000-00000000c0d1",
        name: "Codi",
        role: "Frontend Implementation",
        status: AgentStatus.THINKING,
        statusMessage: "Reviewing UI shell",
        heartbeatAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.agent.upsert({
      where: { id: "00000000-0000-4000-8000-00000000d00d" },
      update: {},
      create: {
        id: "00000000-0000-4000-8000-00000000d00d",
        name: "Ninja",
        role: "Backend & Systems",
        status: AgentStatus.WORKING,
        statusMessage: "Scaffolding Prisma schema",
        heartbeatAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  await prisma.task.createMany({
    data: [
      {
        title: "Wire Mission Control shell",
        description: "Create AppShell layout and navigation placeholders",
        status: TaskStatus.IN_PROGRESS,
        createdById: operator.id,
        createdByType: "operator",
        assignedAgentId: codi.id,
      },
      {
        title: "Define Prisma schema",
        description: "Model tasks, agents, runs, knowledge",
        status: TaskStatus.REVIEW,
        createdById: operator.id,
        createdByType: "operator",
        assignedAgentId: ninja.id,
      },
      {
        title: "Draft API contracts",
        description: "Enumerate payloads + events",
        status: TaskStatus.BACKLOG,
        createdById: operator.id,
        createdByType: "operator",
      },
    ],
  });

  await prisma.run.createMany({
    data: [
      {
        type: "pipeline.bootstrap",
        source: "manual",
        status: RunStatus.SUCCEEDED,
        triggeredBy: operator.id,
        resultSummary: "Initialized repo",
      },
      {
        type: "pipeline.generate-contracts",
        source: "manual",
        status: RunStatus.RUNNING,
        triggeredBy: operator.id,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
