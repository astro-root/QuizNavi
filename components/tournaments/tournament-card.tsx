import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import {
  REGION_LABELS,
  FORMAT_LABELS,
  STATUS_LABELS,
  STATUS_BADGE_STYLE,
  formatDateJa,
} from "@/lib/utils";
import { computeTournamentStatus } from "@/lib/tournament-status";
import type { TournamentStatus } from "@prisma/client";

type TournamentCardProps = {
  tournament: {
    id: string;
    slug: string;
    name: string;
    startAt: Date | null;
    endAt: Date | null;
    entryDeadline: Date | null;
    format: string | null;
    region: string | null;
    prefecture: string | null;
    city: string | null;
    capacity: number | null;
    status: TournamentStatus;
    logoUrl: string | null;
  };
};

export function TournamentCard({ tournament }: TournamentCardProps) {
  const displayStatus = computeTournamentStatus(tournament);

  const locationLabel =
    tournament.format === "ONLINE"
      ? "オンライン開催"
      : [
          tournament.region ? REGION_LABELS[tournament.region] : null,
          tournament.city,
        ]
          .filter(Boolean)
          .join(" / ") || "開催地未定";

  return (
    <Link href={`/tournaments/${tournament.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="flex h-32 items-center justify-center overflow-hidden bg-muted/50">
          {tournament.logoUrl ? (
            <Image
              src={tournament.logoUrl}
              alt={tournament.name}
              width={200}
              height={128}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Trophy className="h-10 w-10 text-muted-foreground/30" />
          )}
        </div>
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
            {tournament.name}
          </h3>
          <Badge className={STATUS_BADGE_STYLE[displayStatus]} variant="outline">
            {STATUS_LABELS[displayStatus]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{tournament.startAt ? formatDateJa(tournament.startAt) : "日程未定"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{locationLabel}</span>
          </div>
          {tournament.capacity && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>定員 {tournament.capacity}名</span>
            </div>
          )}
          <div className="pt-1">
            {tournament.format && (
              <Badge variant="secondary" className="text-xs">
                {FORMAT_LABELS[tournament.format]}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
