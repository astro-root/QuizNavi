import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditTournamentForm } from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/organizer/tournaments/${id}/edit`);

  const [tournament, tags] = await Promise.all([
    prisma.tournament.findUnique({
      where: { id },
      include: { tags: { select: { tagId: true } } },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!tournament || tournament.organizerId !== user.id) {
    notFound();
  }

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-8 text-2xl font-bold">大会を編集する</h1>
      <EditTournamentForm tournament={tournament} tags={tags} />
    </div>
  );
}
