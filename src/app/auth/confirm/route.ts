import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") || "signup";
  const next = url.searchParams.get("next") || "/dashboard";

  if (!tokenHash) {
    return NextResponse.redirect(new URL("/login?error=verification", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as "signup" | "email",
  });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=verification", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
