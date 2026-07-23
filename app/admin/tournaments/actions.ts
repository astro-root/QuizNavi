"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function adminDeleteTournament(tournamentId: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("権限がありません");

  await prisma.tournament.delete({ where: { id: tournamentId } });

  revalidatePath("/admin/tournaments");
  revalidatePath("/tournaments");
}
