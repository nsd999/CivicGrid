import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import prisma from "@/lib/db";
import type { ActionStatus } from "@/types";

const APPROVER_ROLES = ["ADMINISTRATOR", "DISTRICT_OFFICER", "DEPARTMENT_OFFICER"] as const;

type ActionMutation = {
  decision?: "approve" | "reject";
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!APPROVER_ROLES.includes(session.user.role as (typeof APPROVER_ROLES)[number])) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  let body: ActionMutation;
  try {
    body = (await request.json()) as ActionMutation;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.decision !== "approve" && body.decision !== "reject") {
    return NextResponse.json({ success: false, error: "Invalid decision" }, { status: 400 });
  }

  const action = await prisma.action.findUnique({
    where: { id },
    select: {
      id: true,
      module: true,
      title: true,
      status: true,
      aiGenerated: true,
      aiApproved: true,
      assignedDept: true,
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

  const now = new Date();
  const approved = body.decision === "approve";
  const nextStatus: ActionStatus = approved ? "ASSIGNED" : "REVIEWING";

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.action.update({
      where: { id },
      data: {
        aiApproved: approved,
        aiApprovedById: session.user.id,
        aiApprovedAt: now,
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
          aiApprovedById: next.aiApprovedById,
        },
        humanDecision: {
          decision: body.decision,
        },
      },
    });

    return next;
  });

  return NextResponse.json({
    success: true,
    data: updated,
  });
}
