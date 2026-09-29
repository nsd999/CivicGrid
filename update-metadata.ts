import { PrismaClient } from "@prisma/client";
import { DEMO_HEALTH_INVENTORY, DEMO_ASSETS } from "./src/data/demo";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating PHC metadata with medicines...");
  for (const phc of DEMO_HEALTH_INVENTORY) {
    const asset = await prisma.asset.findUnique({ where: { id: phc.phcId } });
    if (asset) {
      const metadata = asset.metadata ? { ...(asset.metadata as any) } : {};
      metadata.medicines = phc.medicines;
      await prisma.asset.update({
        where: { id: phc.phcId },
        data: { metadata },
      });
      console.log(`Updated ${phc.phcName}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
