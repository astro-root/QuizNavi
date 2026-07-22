import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  REGION_LABELS,
  FORMAT_LABELS,
  formatDateJa,
} from "@/lib/utils";
import { PublishControls } from "./publish-controls";
import { computeTournamentStatus } from "@/lib/tournament-status";
import { ResultForm } from "./result-form";
import { Trophy } from "lucide-react";

const PUBLISH_STATUS_LABEL: Record<string, string> = {
  DRAFT: "下書き",
  PUBLISHED: "公開中",
};

const PUBLISH_STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-emerald-500/10 text-emerald-600",
};

export const dynamic = "force-dynamic";

export default async function OrganizerTournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/organizer/tournaments/${id}`);

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!tournament || tournament.organizerId !== user.id) {
    notFound();
  }

  const displayStatus = computeTournamentStatus(tournament);

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex h-36 items-center justify-center bg-muted/50">
          {tournament.logoUrl ? (
            <Image
              src={tournament.logoUrl}
              alt={tournament.name}
              width={300}
              height={144}
              className="h-full w-full object-cover"
            />
          ) : (
            <Trophy className="h-10 w-10 text-muted-foreground/30" />
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold leading-snug">{tournament.name}</h1>
            <Badge
              className={PUBLISH_STATUS_STYLE[tournament.publishStatus]}
              variant="outline"
            >
              {PUBLISH_STATUS_LABEL[tournament.publishStatus]}
            </Badge>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {tournament.format && (
              <Badge variant="secondary">{FORMAT_LABELS[tournament.format]}</Badge>
            )}
            {tournament.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>

          <dl className="space-y-2 text-sm text-muted-foreground">
            <div>
              <dt className="inline font-medium text-foreground">開催日時: </dt>
              <dd className="inline">{tournament.startAt ? formatDateJa(tournament.startAt) : "未定"}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">開催地: </dt>
              <dd className="inline">
                {tournament.format === "ONLINE"
                  ? "オンライン開催"
                  : [
                      tournament.region ? REGION_LABELS[tournament.region] : null,
                      tournament.city,
                    ]
                      .filter(Boolean)
                      .join(" / ") || "未設定"}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">参加費: </dt>
              <dd className="inline">{tournament.fee || "未設定"}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">問い合わせ先: </dt>
              <dd className="inline">{tournament.contact || "未設定"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {displayStatus === "FINISHED" && (
        <div className="mb-4">
          <ResultForm
            tournamentId={tournament.id}
            initialText={tournament.resultText ?? ""}
          />
        </div>
      )}

      <PublishControls
        tournamentId={tournament.id}
        publishStatus={tournament.publishStatus}
        slug={tournament.slug}
      />
    </div>
  );
}
