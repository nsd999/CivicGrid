"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function signUp(_previousState: { error: string }, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Please fill in all the fields." };
  }

  if (password.length < 8) {
    return { error: "Your password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "The passwords do not match." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://civicgridai.vercel.app";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: siteUrl + "/auth/confirm",
    },
  });

  if (error) {
    if (/already registered|already been registered/i.test(error.message)) {
      return { error: "This email is already registered. Please sign in instead." };
    }
    return { error: "We couldn't create your account. Please check your details and try again." };
  }

  if (!data.user) {
    return { error: "We couldn't create your account. Please try again." };
  }

  try {
    await prisma.profile.upsert({
      where: { id: data.user.id },
      update: { email, name },
      create: { id: data.user.id, email, name, role: "CITIZEN", isActive: true },
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    return { error: "Your account was created, but we couldn't finish setting it up. Please try again shortly." };
  }

  redirect("/register/check-email");
}
