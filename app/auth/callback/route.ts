import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/organizer/tournaments";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const existing = await prisma.user.findUnique({
          where: { authId: authUser.id },
        });
        if (!existing) {
          const email = authUser.email ?? `${authUser.id}@unknown.local`;
          const name =
            (authUser.user_metadata?.full_name as string | undefined) ??
            (authUser.user_metadata?.name as string | undefined) ??
            email.split("@")[0];
          const avatarUrl =
            (authUser.user_metadata?.avatar_url as string | undefined) ?? null;

          await prisma.user.create({
            data: { authId: authUser.id, email, name, avatarUrl },
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
