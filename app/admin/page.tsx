import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "管理画面",
};

export default async function AdminHomePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const [userCount, unreadInquiryCount, publishedCount] = await Promise.all([
    prisma.user.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
    prisma.tournament.count({ where: { publishStatus: "PUBLISHED" } }),
  ]);

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">管理画面</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/inquiries"
          className="rounded-lg border p-6 transition-colors hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">未読の問い合わせ</p>
          <p className="text-3xl font-bold">{unreadInquiryCount}</p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-lg border p-6 transition-colors hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">登録ユーザー数</p>
          <p className="text-3xl font-bold">{userCount}</p>
        </Link>
        <Link
          href="/admin/tournaments"
          className="rounded-lg border p-6 transition-colors hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">公開中の大会</p>
          <p className="text-3xl font-bold">{publishedCount}</p>
        </Link>
        <Link
          href="/admin/announcements"
          className="rounded-lg border p-6 transition-colors hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">お知らせ管理</p>
          <p className="text-3xl font-bold">→</p>
        </Link>
      </div>
    </div>
  );
}
