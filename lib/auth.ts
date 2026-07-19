import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  return user;
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN";
}

export function isOrganizer(user: User | null): boolean {
  return user?.role === "ORGANIZER" || user?.role === "ADMIN";
}

export function canEditTournament(
  user: User | null,
  organizerId: string
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.role === "ORGANIZER" && user.id === organizerId;
}
