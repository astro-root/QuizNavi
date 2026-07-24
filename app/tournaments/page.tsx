import { prisma } from "@/lib/prisma";
import { TournamentCard } from "@/components/tournaments/tournament-card";
import { TournamentFilters } from "./tournament-filters";
import { computeTournamentStatus } from "@/lib/tournament-status";
import type { Prisma, Region, TournamentFormat, TournamentStatus } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大会を探す",
  description:
    "全国のクイズ大会を地域・開催形式・タグから検索できます。締切が近い大会もすぐに見つかります。",
};

type SearchParams = {
  q?: string;
  region?: string;
  format?: string;
  status?: string;
  sort?: string;
  tagQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  feeMin?: string;
  feeMax?: string;
};

export const dynamic = "force-dynamic";

// 参加費は自由記述のため、"1000円"のように半角数字+円のみで書かれている場合だけ数値として扱う。
const FEE_PATTERN = /^([0-9]+)\s*円$/;

function parseFee(fee: string | null): number | null {
  if (!fee) return null;
  const match = fee.trim().match(FEE_PATTERN);
  if (!match) return null;
  return Number(match[1]);
}

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
  if (params.tagQuery) {
    where.tags = {
      some: { tag: { name: { contains: params.tagQuery, mode: "insensitive" } } },
    };
  }
  if (params.dateFrom || params.dateTo) {
    where.startAt = {
      ...(params.dateFrom ? { gte: new Date(`${params.dateFrom}T00:00:00`) } : {}),
      ...(params.dateTo ? { lte: new Date(`${params.dateTo}T23:59:59`) } : {}),
    };
  }

  const orderBy: Prisma.TournamentOrderByWithRelationInput =
    params.sort === "deadline" ? { entryDeadline: "asc" } : { startAt: "asc" };

  const allMatching = await prisma.tournament.findMany({
    where,
    orderBy,
    // statusは動的計算のためDBフィルタできない。取得後に絞り込むので多めに取得する。
    take: 300,
  });

  const statusFilter = params.status as TournamentStatus | undefined;
  let filtered = statusFilter
    ? allMatching.filter((t) => computeTournamentStatus(t) === statusFilter)
    : allMatching;

  const feeMin = params.feeMin ? Number(params.feeMin) : undefined;
  const feeMax = params.feeMax ? Number(params.feeMax) : undefined;
  if (feeMin !== undefined || feeMax !== undefined) {
    filtered = filtered.filter((t) => {
      const value = parseFee(t.fee);
      if (value === null) return false;
      if (feeMin !== undefined && value < feeMin) return false;
      if (feeMax !== undefined && value > feeMax) return false;
      return true;
    });
  }

  const tournaments = filtered.slice(0, 50);

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">大会を探す</h1>

      <TournamentFilters />

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
