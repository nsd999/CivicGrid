"use server";

import { signOut } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await signOut();
  redirect("/login");
}
