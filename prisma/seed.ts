import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEMO_LOCATIONS,
  DEMO_ASSETS,
  DEMO_REPORTS,
  DEMO_ACTIONS,
  DEMO_RISKS,
  DEMO_EVENTS,
  DEMO_MISSIONS,
  DEMO_NOTIFICATIONS,
  DEMO_HEALTH_INVENTORY,
} from "../src/data/demo";

const DEMO_USERS = [
  { id: "user-1", email: "collector@civicgrid.in", name: "District Collector", role: "DISTRICT_COLLECTOR" as any, department: "Revenue" },
  { id: "user-2", email: "nodal@civicgrid.in", name: "Nodal Officer", role: "NODAL_OFFICER" as any, department: "GHMC" },
  { id: "user-3", email: "citizen@civicgrid.in", name: "Citizen User", role: "CITIZEN" as any, department: null },
];

const prisma = new PrismaClient();
const DEMO_PASSWORD = "demo1234";

async function main() {
  console.log("Seeding database with full demo dataset...");

  // 1. Users
  console.log("Seeding users...");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const user of DEMO_USERS) {
    await prisma.profile.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as any,
        department: user.department,
        passwordHash,
      },
    });
  }

  // 2. Locations
  console.log("Seeding locations...");
  for (const loc of DEMO_LOCATIONS) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {},
      create: {
        id: loc.id,
        name: loc.name,
        ward: loc.ward,
        district: loc.district,
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
    });
  }

  // 3. Assets
  console.log("Seeding assets...");
  for (const asset of DEMO_ASSETS) {
    // Inject health inventory into PHC metadata if applicable
    const phcInventory = DEMO_HEALTH_INVENTORY.find(inv => inv.phcId === asset.id);
    const metadata = asset.metadata ? { ...(asset.metadata as any) } : {};
    if (phcInventory) {
      metadata.medicines = phcInventory.medicines;
    }

    await prisma.asset.upsert({
      where: { id: asset.id },
      update: {
        metadata: metadata,
      },
      create: {
        id: asset.id,
        name: asset.name,
        type: asset.type as any,
        locationId: asset.locationId,
        address: asset.address,
        latitude: asset.latitude,
        longitude: asset.longitude,
        ward: asset.ward,
        department: asset.department,
        capacity: asset.capacity,
        metadata: metadata,
        isActive: asset.isActive,
        createdAt: new Date(asset.createdAt),
      },
    });
  }

  // 4. Citizen Reports
  console.log("Seeding reports...");
  for (const report of DEMO_REPORTS) {
    await prisma.citizenReport.upsert({
      where: { id: report.id },
      update: {},
      create: {
        id: report.id,
        category: report.category as any,
        title: report.title,
        description: report.description,
        locationId: report.locationId,
        address: report.address,
        latitude: report.latitude,
        longitude: report.longitude,
        ward: report.ward,
        severity: report.severity as any,
        aiCategory: report.aiCategory,
        aiSummary: report.aiSummary,
        aiDepartment: report.aiDepartment,
        aiConfidence: report.aiConfidence,
        status: report.status as any,
        isAnonymous: report.isAnonymous,
        createdAt: new Date(report.createdAt),
      },
    });
  }

  // 5. Events
  console.log("Seeding events...");
  for (const event of DEMO_EVENTS) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        title: event.title,
        description: event.description,
        module: event.module as any,
        source: event.source as any,
        status: event.status as any,
        severity: event.severity as any,
        ward: event.ward,
        metadata: event.metadata as any,
        detectedAt: new Date(event.detectedAt),
        createdAt: new Date(event.createdAt),
      },
    });
  }

  // 6. Actions
  console.log("Seeding actions...");
  for (const action of DEMO_ACTIONS) {
    await prisma.action.upsert({
      where: { id: action.id },
      update: {},
      create: {
        id: action.id,
        module: action.module as any,
        title: action.title,
        description: action.description,
        priority: action.priority as any,
        status: action.status as any,
        locationId: action.locationId,
        ward: action.ward,
        reason: action.reason,
        recommendedAction: action.recommendedAction,
        assignedDept: action.assignedDept,
        aiGenerated: action.aiGenerated,
        aiApproved: action.aiApproved,
        slaBreached: action.slaBreached,
        dueAt: action.dueAt ? new Date(action.dueAt) : null,
        createdAt: new Date(action.createdAt),
        updatedAt: new Date(action.updatedAt),
      },
    });
  }

  // 7. Risk Assessments
  console.log("Seeding risks...");
  for (const risk of DEMO_RISKS) {
    await prisma.riskAssessment.upsert({
      where: { id: risk.id },
      update: {},
      create: {
        id: risk.id,
        module: risk.module as any,
        assetId: risk.assetId,
        ward: risk.ward,
        priority: risk.priority as any,
        priorityScore: risk.priorityScore,
        populationAffected: risk.populationAffected,
        reportCount: risk.reportCount,
        recurrenceCount: risk.recurrenceCount,
        factors: risk.factors as any,
        aiExplanation: risk.aiExplanation,
        aiConfidence: risk.aiConfidence,
        aiProvider: risk.aiProvider,
        createdAt: new Date(risk.createdAt),
      },
    });
  }

  // 8. Missions
  console.log("Seeding missions...");
  for (const mission of DEMO_MISSIONS) {
    await prisma.mission.upsert({
      where: { id: mission.id },
      update: {},
      create: {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        modules: mission.modules as any[],
        status: mission.status as any,
        priority: mission.priority as any,
        ward: mission.ward,
        startedAt: new Date(mission.startedAt),
        metadata: mission.metadata as any,
        createdAt: new Date(mission.createdAt),
      },
    });
  }

  // 9. Notifications
  console.log("Seeding notifications...");
  for (const notif of DEMO_NOTIFICATIONS) {
    await prisma.notification.upsert({
      where: { id: notif.id },
      update: {},
      create: {
        id: notif.id,
        profileId: notif.profileId,
        type: notif.type as any,
        title: notif.title,
        message: notif.message,
        module: notif.module as any,
        actionId: notif.actionId,
        missionId: notif.missionId,
        isRead: notif.isRead,
        createdAt: new Date(notif.createdAt),
      },
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
