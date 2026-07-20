import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "お知らせ",
  description: "QuizNaviからのお知らせ一覧です。",
};

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-8 text-2xl font-bold">お知らせ</h1>

      {announcements.length === 0 ? (
        <p className="text-muted-foreground">現在お知らせはありません。</p>
      ) : (
        <div className="space-y-6">
          {announcements.map((a) => (
            <article key={a.id} className="rounded-lg border p-6">
              <p className="mb-1 text-xs text-muted-foreground">
                {a.publishedAt?.toLocaleDateString("ja-JP")}
              </p>
              <h2 className="mb-2 text-lg font-semibold">{a.title}</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {a.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
