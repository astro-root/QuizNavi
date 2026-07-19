import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CalendarPlus,
  Map,
  MapPin,
  Users,
  Wallet,
  Phone,
  ExternalLink,
} from "lucide-react";
import {
  REGION_LABELS,
  FORMAT_LABELS,
  STATUS_LABELS,
  STATUS_BADGE_STYLE,
  formatDateJa,
} from "@/lib/utils";

// Googleカレンダーの日時パラメータ用に UTC の YYYYMMDDTHHMMSSZ 形式へ変換する
function formatGCalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// 予定の長さが不明なため、開始から3時間を仮の終了時刻として扱う
const DEFAULT_EVENT_DURATION_MS = 3 * 60 * 60 * 1000;

function buildGoogleCalendarUrl(tournament: {
  name: string;
  startAt: Date;
  endAt: Date | null;
  description: string | null;
  address: string | null;
  venueName: string | null;
  city: string | null;
}): string {
  const start = tournament.startAt;
  // endAtが登録されていればそれを使い、未登録の場合のみ3時間後を仮の終了時刻とする
  const end =
    tournament.endAt ?? new Date(start.getTime() + DEFAULT_EVENT_DURATION_MS);

  const location =
    tournament.address ||
    [tournament.venueName, tournament.city].filter(Boolean).join(" ") ||
    "";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: tournament.name,
    dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
    details: tournament.description ?? "",
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildGoogleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
      organizer: { select: { name: true } },
    },
  });

  if (!tournament || tournament.publishStatus !== "PUBLISHED") {
    notFound();
  }

  const isOnline = tournament.format === "ONLINE";

  const locationLabel = isOnline
    ? "オンライン開催"
    : [
        tournament.region ? REGION_LABELS[tournament.region] : null,
        tournament.city,
        tournament.venueName,
      ]
        .filter(Boolean)
        .join(" / ") || "開催地未定";

  const mapsQuery =
    tournament.address ||
    [tournament.venueName, tournament.city].filter(Boolean).join(" ");

  const mapsUrl =
    !isOnline && mapsQuery ? buildGoogleMapsUrl(mapsQuery) : null;

  const calendarUrl = buildGoogleCalendarUrl(tournament);

  return (
    <div className="container py-10 max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold leading-snug">{tournament.name}</h1>
        <Badge
          className={STATUS_BADGE_STYLE[tournament.status]}
          variant="outline"
        >
          {STATUS_LABELS[tournament.status]}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="secondary">{FORMAT_LABELS[tournament.format]}</Badge>
        {tournament.tags.map(({ tag }) => (
          <Badge key={tag.id} variant="outline">
            {tag.name}
          </Badge>
        ))}
      </div>

      {tournament.description && (
        <p className="text-muted-foreground whitespace-pre-wrap mb-6">
          {tournament.description}
        </p>
      )}

      <Separator className="my-6" />

      <dl className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-muted-foreground">開催日時</dt>
            <dd>{formatDateJa(tournament.startAt)}</dd>
            {tournament.entryDeadline && (
              <dd className="text-muted-foreground text-xs mt-0.5">
                参加申込締切: {formatDateJa(tournament.entryDeadline)}
              </dd>
            )}
            <dd className="mt-1.5">
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Googleカレンダーに追加
              </a>
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-muted-foreground">開催場所</dt>
            <dd>{locationLabel}</dd>
            {tournament.address && (
              <dd className="text-muted-foreground text-xs mt-0.5">
                {tournament.address}
              </dd>
            )}
            {mapsUrl && (
              <dd className="mt-1.5">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Map className="h-3.5 w-3.5" />
                  Googleマップで開く
                </a>
              </dd>
            )}
          </div>
        </div>

        {tournament.capacity && (
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <dt className="text-muted-foreground">定員</dt>
              <dd>{tournament.capacity}名</dd>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Wallet className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-muted-foreground">参加費</dt>
            <dd>{tournament.fee}</dd>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-muted-foreground">問い合わせ先</dt>
            <dd>{tournament.contact}</dd>
          </div>
        </div>
      </dl>

      {(tournament.entryFormUrl || tournament.officialSite) && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-wrap gap-3">
            {tournament.entryFormUrl ? (
              <a
                href={tournament.entryFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                参加申込フォーム <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {tournament.officialSite ? (
              <a
                href={tournament.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                公式サイト <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground mt-10">
        主催: {tournament.organizer.name}
      </p>
    </div>
  );
}
