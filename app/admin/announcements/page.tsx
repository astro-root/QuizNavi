import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "./announcement-form";
import { AnnouncementRow } from "./announcement-row";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="mb-6 text-2xl font-bold">お知らせ管理</h1>

      <div className="mb-8">
        <AnnouncementForm />
      </div>

      {announcements.length === 0 ? (
        <p className="text-muted-foreground">お知らせはまだありません。</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {announcements.map((a) => (
            <AnnouncementRow
              key={a.id}
              id={a.id}
              title={a.title}
              body={a.body}
              isPublished={a.isPublished}
              createdAt={a.createdAt.toLocaleDateString("ja-JP")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
