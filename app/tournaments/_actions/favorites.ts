"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(tournamentId: string, slug: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/tournaments/${slug}`);

  const existing = await prisma.favorite.findUnique({
    where: { userId_tournamentId: { userId: user.id, tournamentId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: { userId: user.id, tournamentId },
    });
  }

  revalidatePath(`/tournaments/${slug}`);
  revalidatePath("/favorites");
}
