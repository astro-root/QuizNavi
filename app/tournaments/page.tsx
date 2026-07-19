import { prisma } from "@/lib/prisma";
import { TournamentCard } from "@/components/tournaments/tournament-card";
import type { Prisma, Region, TournamentFormat, TournamentStatus } from "@prisma/client";

type SearchParams = {
  q?: string;
  region?: string;
  format?: string;
  status?: string;
  sort?: string;
};

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.TournamentWhereInput = {
    publishStatus: "PUBLISHED",
  };

  if (params.q) {
    where.name = { contains: params.q, mode: "insensitive" };
  }
  if (params.region) {
    where.region = params.region as Region;
  }
  if (params.format) {
    where.format = params.format as TournamentFormat;
  }
  if (params.status) {
    where.status = params.status as TournamentStatus;
  }

  const orderBy: Prisma.TournamentOrderByWithRelationInput =
    params.sort === "deadline"
      ? { entryDeadline: "asc" }
      : { startAt: "asc" };

  const tournaments = await prisma.tournament.findMany({
    where,
    orderBy,
    take: 50,
  });

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">大会を探す</h1>

      {tournaments.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">
          条件に一致する大会が見つかりませんでした。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}
