import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "demo1234";

const DEMO_USERS = [
  {
    id: "demo-admin-001",
    email: "admin@civicgrid.demo",
    name: "Priya Reddy",
    role: "ADMINISTRATOR",
    department: "Administration",
  },
  {
    id: "demo-district-001",
    email: "district@civicgrid.demo",
    name: "Rajesh Kumar",
    role: "DISTRICT_OFFICER",
    department: "District Administration",
  },
  {
    id: "demo-officer-001",
    email: "officer@civicgrid.demo",
    name: "Anitha Sharma",
    role: "DEPARTMENT_OFFICER",
    department: "GHMC",
  },
  {
    id: "demo-field-001",
    email: "field@civicgrid.demo",
    name: "Mohammed Rafi",
    role: "FIELD_WORKER",
    department: "GHMC",
  },
  {
    id: "demo-citizen-001",
    email: "citizen@civicgrid.demo",
    name: "Lakshmi Devi",
    role: "CITIZEN",
    department: null,
  },
];

async function main() {
  console.log("Seeding database...");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const user of DEMO_USERS) {
    const existing = await prisma.profile.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          department: user.department,
          passwordHash,
        },
      });
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }
  
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
