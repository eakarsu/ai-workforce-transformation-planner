import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const existing = await prisma.staffTask.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (body.status === "DONE") { data.status = "DONE"; data.completedAt = new Date(); }
  else if (body.status === "OPEN") { data.status = "OPEN"; data.completedAt = null; }
  else if (body.status === "CANCELLED") { data.status = "CANCELLED"; data.completedAt = null; }
  else if (body.status !== undefined) return NextResponse.json({ error: "status must be OPEN, DONE, or CANCELLED" }, { status: 422 });
  if (typeof body.assigneeId === "string" || body.assigneeId === null) data.assigneeId = body.assigneeId;
  if (Object.keys(data).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 422 });
  const task = await prisma.staffTask.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorId: user.id, actorName: user.name ?? user.email ?? "user", action: "TASK_UPDATED", entity: "StaffTask", entityId: task.id, detail: String(data.status ?? "updated") } });
  return NextResponse.json({ task });
}
