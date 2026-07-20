import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarPlus,
  Map,
  MapPin,
  Users,
  Wallet,
  Phone,
  ExternalLink,
  FileText,
  Clock,
  ScrollText,
  ListChecks,
  Trophy,
} from "lucide-react";
import {
  REGION_LABELS,
  FORMAT_LABELS,
  STATUS_LABELS,
  STATUS_BADGE_STYLE,
  formatDateJa,
} from "@/lib/utils";

function formatGCalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

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

export const dynamic = "force-dynamic";

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

  const mapsUrl = !isOnline && mapsQuery ? buildGoogleMapsUrl(mapsQuery) : null;
  const calendarUrl = buildGoogleCalendarUrl(tournament);

  const resourceLinks = [
    { href: tournament.entryFormUrl, label: "参加申込フォーム", icon: ExternalLink },
    { href: tournament.entryListUrl, label: "参加者一覧", icon: ListChecks },
    { href: tournament.pdfUrl, label: "企画書", icon: FileText },
    { href: tournament.timetableUrl, label: "タイムテーブル", icon: Clock },
    { href: tournament.rulesUrl, label: "ルール", icon: ScrollText },
    { href: tournament.officialSite, label: "公式サイト", icon: ExternalLink },
    { href: tournament.officialX, label: "公式X", icon: ExternalLink },
  ].filter((l): l is { href: string; label: string; icon: typeof ExternalLink } =>
    Boolean(l.href)
  );

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6 animate-in fade-in-0 slide-in-from-bottom-2 overflow-hidden rounded-2xl border bg-card shadow-sm duration-500">
        <div className="flex h-40 items-center justify-center bg-muted/50 sm:h-52">
          {tournament.logoUrl ? (
            <Image
              src={tournament.logoUrl}
              alt={tournament.name}
              width={400}
              height={208}
              className="h-full w-full object-cover"
            />
          ) : (
            <Trophy className="h-14 w-14 text-muted-foreground/30" />
          )}
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold leading-snug">{tournament.name}</h1>
            <Badge className={STATUS_BADGE_STYLE[tournament.status]} variant="outline">
              {STATUS_LABELS[tournament.status]}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{FORMAT_LABELS[tournament.format]}</Badge>
            {tournament.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>

          {tournament.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
              {tournament.description}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 grid animate-in fade-in-0 slide-in-from-bottom-2 grid-cols-1 gap-3 duration-500 [animation-delay:100ms] fill-mode-both sm:grid-cols-2">
        <InfoCard icon={Calendar} label="開催日時">
          <p>{formatDateJa(tournament.startAt)}</p>
          {tournament.entryDeadline && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              参加申込締切: {formatDateJa(tournament.entryDeadline)}
            </p>
          )}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Googleカレンダーに追加
          </a>
        </InfoCard>

        <InfoCard icon={MapPin} label="開催場所">
          <p>{locationLabel}</p>
          {tournament.address && (
            <p className="mt-0.5 text-xs text-muted-foreground">{tournament.address}</p>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Map className="h-3.5 w-3.5" />
              Googleマップで開く
            </a>
          )}
        </InfoCard>

        {tournament.capacity && (
          <InfoCard icon={Users} label="定員">
            <p>{tournament.capacity}名</p>
          </InfoCard>
        )}

        <InfoCard icon={Wallet} label="参加費">
          <p>{tournament.fee}</p>
        </InfoCard>

        <InfoCard icon={Phone} label="問い合わせ先">
          <p>{tournament.contact}</p>
        </InfoCard>
      </div>

      {resourceLinks.length > 0 && (
        <div className="mb-6 animate-in fade-in-0 slide-in-from-bottom-2 rounded-xl border bg-card p-5 shadow-sm duration-500 [animation-delay:150ms] fill-mode-both">
          <p className="mb-3 text-sm font-semibold text-muted-foreground">関連リンク</p>
          <div className="flex flex-wrap gap-2">
            {resourceLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      <p className="animate-in fade-in-0 text-xs text-muted-foreground duration-500 [animation-delay:200ms] fill-mode-both">
        主催: {tournament.organizer.name}
      </p>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
