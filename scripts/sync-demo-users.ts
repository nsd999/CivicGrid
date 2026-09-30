import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

const DEMO_USERS = [
  { role: "ADMINISTRATOR", email: "admin@civicgrid.demo", name: "Ananya Sharma", department: "Central Administration" },
  { role: "DISTRICT_OFFICER", email: "district@civicgrid.demo", name: "Rahul Verma", department: "District Operations" },
  { role: "DEPARTMENT_OFFICER", email: "officer@civicgrid.demo", name: "Priya Patel", department: "Public Works" },
  { role: "FIELD_WORKER", email: "field@civicgrid.demo", name: "Vikram Singh", department: "Field Operations" },
  { role: "CITIZEN", email: "citizen@civicgrid.demo", name: "Meera Reddy", department: null },
];

async function syncDemoUsers() {
  console.log("Syncing demo users to Supabase Auth...");

  for (const user of DEMO_USERS) {
    console.log(`Processing ${user.email}...`);
    
    // Attempt sign up
    let authUser;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: user.email,
      password: "demo1234",
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        console.log(`User ${user.email} already registered in Supabase. Attempting login...`);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: "demo1234",
        });
        if (signInError) {
          console.error(`Failed to login ${user.email}:`, signInError.message);
          continue;
        }
        authUser = signInData.user;
      } else {
        console.error(`Failed to sign up ${user.email}:`, signUpError.message);
        continue;
      }
    } else {
      authUser = signUpData.user;
    }

    if (authUser) {
      // Delete existing profile to avoid PK conflicts
      try {
        await prisma.profile.delete({ where: { email: user.email } });
      } catch (e) {
        // Ignored
      }
      
      // Upsert profile in Prisma with the exact UUID from Supabase Auth
      await prisma.profile.create({
        data: {
          id: authUser.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          department: user.department,
        }
      });
      console.log(`Successfully synced ${user.email} with UUID ${authUser.id}`);
    }
  }

  console.log("Done.");
}

syncDemoUsers().catch(console.error).finally(() => prisma.$disconnect());
