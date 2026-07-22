import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "下書き",
  PUBLISHED: "公開中",
};

export default async function OrganizerTournamentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/organizer/tournaments");
  }

  const tournaments = await prisma.tournament.findMany({
    where: { organizerId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">主催した大会</h1>
        <Button asChild>
          <Link href="/organizer/tournaments/new">大会を登録する</Link>
        </Button>
      </div>

      {tournaments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          <p>まだ登録した大会がありません</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/organizer/tournaments/new">最初の大会を登録する</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/organizer/tournaments/${t.id}`}
              className="flex items-center justify-between p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t.startAt ? t.startAt.toLocaleDateString("ja-JP") : "未定"}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {STATUS_LABEL[t.publishStatus] ?? t.publishStatus}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
