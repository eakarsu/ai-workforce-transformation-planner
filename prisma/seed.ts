// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const passwordHash = await bcrypt.hash("Demo!23456", 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-workforce-transformation-planner.local", "Demo Admin", "ADMIN"],
    ["manager@ai-workforce-transformation-planner.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-workforce-transformation-planner.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_JobRole = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.jobRole.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.jobRole.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      department: `Department ${String(i + 1).padStart(3, "0")}`,
      level: `Level ${String(i + 1).padStart(3, "0")}`,
      headcount: 5 + ((i * 13) % 95),
      avgSalary: amount(i, 250),
      status: pick(STATUSES_JobRole, i)
      },
    });
  }

  const jobRoleRefs = await prisma.jobRole.findMany({ select: { id: true } });

  const STATUSES_TaskInventory = ["AUTOMATE", "AI_ASSISTED", "HUMAN_ONLY", "UNDECIDED"];
  await prisma.taskInventory.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.taskInventory.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      frequency: `Frequency ${String(i + 1).padStart(3, "0")}`,
      hoursPerWeek: amount(i, 250),
      classification: `Classification ${String(i + 1).padStart(3, "0")}`,
      evidence: `Evidence ${String(i + 1).padStart(3, "0")}`,
      automationConfidence: amount(i, 250),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_AutomationAssessment = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.automationAssessment.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.automationAssessment.create({
      data: {
      taskRef: `TaskRef ${String(i + 1).padStart(3, "0")}`,
      tooling: `Tooling ${String(i + 1).padStart(3, "0")}`,
      feasibility: `Feasibility ${String(i + 1).padStart(3, "0")}`,
      estimatedSavings: amount(i, 250),
      risk: `Risk ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_AutomationAssessment, i),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_ReskillingPlan = ["DRAFT", "ACTIVE", "ON_TRACK", "AT_RISK"];
  await prisma.reskillingPlan.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.reskillingPlan.create({
      data: {
      employeeRef: `EmployeeRef ${String(i + 1).padStart(3, "0")}`,
      targetRole: `TargetRole ${String(i + 1).padStart(3, "0")}`,
      curriculum: `Curriculum ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ReskillingPlan, i),
      startDate: daysAgo(i),
      targetComplete: daysAgo(i),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_TransitionPath = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.transitionPath.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.transitionPath.create({
      data: {
      fromRole: `FromRole ${String(i + 1).padStart(3, "0")}`,
      toRole: `ToRole ${String(i + 1).padStart(3, "0")}`,
      gapSkills: `GapSkills ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_TransitionPath, i),
      durationWeeks: 5 + ((i * 13) % 95),
      successRate: amount(i, 250),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_ProductivityTarget = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.productivityTarget.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.productivityTarget.create({
      data: {
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      baselineValue: amount(i, 250),
      targetValue: amount(i, 250),
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ProductivityTarget, i),
      sponsor: `Sponsor ${String(i + 1).padStart(3, "0")}`,
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_DisplacementForecast = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.displacementForecast.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.displacementForecast.create({
      data: {
      horizon: `Horizon ${String(i + 1).padStart(3, "0")}`,
      exposurePct: amount(i, 250),
      affectedFte: 5 + ((i * 13) % 95),
      mitigation: `Mitigation ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_DisplacementForecast, i),
      modeledAt: daysAgo(i),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_Employee = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.employee.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.employee.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      employeeId: `EmployeeId ${String(i + 1).padStart(3, "0")}`,
      roleTitle: `RoleTitle ${String(i + 1).padStart(3, "0")}`,
      manager: `Manager ${String(i + 1).padStart(3, "0")}`,
      hiredAt: daysAgo(i),
      status: pick(STATUSES_Employee, i),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_SkillGap = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.skillGap.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.skillGap.create({
      data: {
      skill: `Skill ${String(i + 1).padStart(3, "0")}`,
      currentLevel: `CurrentLevel ${String(i + 1).padStart(3, "0")}`,
      requiredLevel: `RequiredLevel ${String(i + 1).padStart(3, "0")}`,
      trainingRef: `TrainingRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_SkillGap, i),
      gapScore: amount(i, 250),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_Scenario = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.scenario.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.scenario.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      assumptions: `Assumptions ${String(i + 1).padStart(3, "0")}`,
      headcountDelta: amount(i, 250),
      costDelta: amount(i, 250),
      decision: `Decision ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Scenario, i),
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_GovernanceAction = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.governanceAction.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.governanceAction.create({
      data: {
      action: `Action ${String(i + 1).padStart(3, "0")}`,
      owner: `Owner ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_GovernanceAction, i),
      dueDate: daysAgo(i),
      notes: `Notes ${String(i + 1).padStart(3, "0")}`,
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  const STATUSES_LearningResource = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.learningResource.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.learningResource.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      provider: `Provider ${String(i + 1).padStart(3, "0")}`,
      durationHours: 5 + ((i * 13) % 95),
      cost: `Cost ${String(i + 1).padStart(3, "0")}`,
      skillTag: `SkillTag ${String(i + 1).padStart(3, "0")}`,
      format: `Format ${String(i + 1).padStart(3, "0")}`,
      role: { connect: { id: jobRoleRefs[i % jobRoleRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
