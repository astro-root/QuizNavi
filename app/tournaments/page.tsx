import { prisma } from "@/lib/prisma";
import { TournamentCard } from "@/components/tournaments/tournament-card";
import { TournamentFilters } from "./tournament-filters";
import type { Prisma, Region, TournamentFormat, TournamentStatus } from "@prisma/client";

type SearchParams = {
  q?: string;
  region?: string;
  format?: string;
  status?: string;
  sort?: string;
  tag?: string | string[];
};

export const dynamic = "force-dynamic";

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

  const tagIds = params.tag
    ? Array.isArray(params.tag)
      ? params.tag
      : [params.tag]
    : [];
  if (tagIds.length > 0) {
    where.tags = { some: { tagId: { in: tagIds } } };
  }

  const orderBy: Prisma.TournamentOrderByWithRelationInput =
    params.sort === "deadline" ? { entryDeadline: "asc" } : { startAt: "asc" };

  const [tournaments, tags] = await Promise.all([
    prisma.tournament.findMany({
      where,
      orderBy,
      take: 50,
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">大会を探す</h1>

      <TournamentFilters tags={tags} />

      {tournaments.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground animate-in fade-in-0 duration-300">
          条件に一致する大会が見つかりませんでした。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament, i) => (
            <div
              key={tournament.id}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-both"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              <TournamentCard tournament={tournament} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
