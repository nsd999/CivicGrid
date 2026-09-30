import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import prisma from "@/lib/db";

const APPROVER_ROLES = new Set([
  "ADMINISTRATOR",
  "DISTRICT_OFFICER",
  "DEPARTMENT_OFFICER",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!APPROVER_ROLES.has(session.user.role)) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (body?.decision !== "approve" && body?.decision !== "reject") {
    return NextResponse.json({ success: false, error: "Invalid decision" }, { status: 400 });
  }

  const action = await prisma.action.findUnique({
    where: { id },
    select: {
      id: true,
      module: true,
      status: true,
      aiGenerated: true,
      aiApproved: true,
    },
  });

  if (!action) {
    return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });
  }

  if (!action.aiGenerated) {
    return NextResponse.json(
      { success: false, error: "Only AI-generated actions require approval" },
      { status: 409 }
    );
  }

  if (session.user.role === "DEPARTMENT_OFFICER") {
    const fullAction = await prisma.action.findUnique({
      where: { id },
      select: { assignedDept: true },
    });
    if ((fullAction?.assignedDept ?? null) !== (session.user.department ?? null)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
  }

  const approved = body.decision === "approve";
  const nextStatus = approved ? "ASSIGNED" : "REVIEWING";

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.action.update({
      where: { id },
      data: {
        aiApproved: approved,
        aiApprovedById: session.user.id,
        aiApprovedAt: new Date(),
        status: nextStatus,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: approved ? "ACTION_AI_APPROVED" : "ACTION_AI_REJECTED",
        module: action.module,
        resource: "action",
        resourceId: action.id,
        previousState: {
          status: action.status,
          aiApproved: action.aiApproved,
        },
        newState: {
          status: next.status,
          aiApproved: next.aiApproved,
          aiApprovedById: session.user.id,
        },
        humanDecision: {
          decision: body.decision,
        },
      },
    });

    return next;
  });

  return NextResponse.json({ success: true, data: updated });
}
