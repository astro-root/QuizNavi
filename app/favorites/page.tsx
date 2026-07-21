import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TournamentCard } from "@/components/tournaments/tournament-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "お気に入り",
};

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/favorites");

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { tournament: true },
    orderBy: { createdAt: "desc" },
  });

  const tournaments = favorites
    .map((f) => f.tournament)
    .filter((t) => t.publishStatus === "PUBLISHED");

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">お気に入りの大会</h1>

      {tournaments.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          お気に入りに登録した大会はまだありません。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}
