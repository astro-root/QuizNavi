import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User as PrismaUser } from "@prisma/client";

export async function getCurrentUser(): Promise<PrismaUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const existing = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });
  if (existing) return existing;

  const email = authUser.email ?? `${authUser.id}@unknown.local`;
  const name =
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    email.split("@")[0];
  const avatarUrl =
    (authUser.user_metadata?.avatar_url as string | undefined) ?? null;

  return prisma.user.create({
    data: {
      authId: authUser.id,
      email,
      name,
      avatarUrl,
    },
  });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}
