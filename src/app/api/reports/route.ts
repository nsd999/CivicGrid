import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/config";
import prisma from "@/lib/db";

const ReportSchema = z.object({
  title: z.string().trim().min(3).max(160),
  category: z.enum([
    "ROAD",
    "DRAINAGE",
    "WASTE",
    "STREETLIGHT",
    "WATER",
    "PUBLIC_BUILDING",
    "PUBLIC_TRANSPORT",
    "HEALTH",
    "OTHER",
  ]),
  ward: z.string().trim().min(1).max(120),
  description: z.string().trim().max(5000).default(""),
  isAnonymous: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const parsed = ReportSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid report details" },
      { status: 400 }
    );
  }

  const { title, category, ward, description, isAnonymous } = parsed.data;

  const report = await prisma.$transaction(async (tx) => {
    const created = await tx.citizenReport.create({
      data: {
        submittedById: isAnonymous ? null : session.user.id,
        category,
        title,
        description,
        ward,
        severity: "MEDIUM",
        status: "NEW",
        isAnonymous,
      },
    });

    await tx.event.create({
      data: {
        title: `Citizen report: ${title}`,
        description: description || `Citizen report submitted for ${ward}`,
        module: "CIVICGRID_CORE",
        source: "CITIZEN_REPORT",
        status: "DETECTED",
        severity: "MEDIUM",
        ward,
        reportId: created.id,
        detectedAt: created.createdAt,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CITIZEN_REPORT_CREATED",
        module: "CIVICGRID_CORE",
        resource: "citizen_report",
        resourceId: created.id,
        newState: { category, ward, anonymous: isAnonymous },
      },
    });

    return created;
  });

  return NextResponse.json(
    {
      success: true,
      data: { id: report.id, status: report.status, createdAt: report.createdAt },
    },
    { status: 201 }
  );
}
