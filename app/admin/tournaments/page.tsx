import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "下書き",
  PENDING: "承認待ち",
  PUBLISHED: "公開中",
  REJECTED: "却下",
};

export const dynamic = "force-dynamic";

export default async function AdminTournamentsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const tournaments = await prisma.tournament.findMany({
    where: { publishStatus: "PUBLISHED" },
    include: { organizer: { select: { name: true, email: true } } },
    orderBy: { startAt: "asc" },
  });

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">公開中の大会</h1>

      {tournaments.length === 0 ? (
        <p className="text-muted-foreground">公開中の大会はまだありません。</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">大会名</th>
                <th className="p-3">主催者</th>
                <th className="p-3">開催日</th>
                <th className="p-3">ステータス</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tournaments.map((t) => (
                <tr key={t.id}>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 text-muted-foreground">
                    {t.organizer.name} ({t.organizer.email})
                  </td>
                  <td className="p-3">{t.startAt ? t.startAt.toLocaleDateString("ja-JP") : "未定"}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {STATUS_LABEL[t.publishStatus] ?? t.publishStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/tournaments/${t.slug}`}
                      className="text-primary hover:underline"
                    >
                      表示
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
