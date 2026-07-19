import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const [userCount, unreadInquiryCount] = await Promise.all([
    prisma.user.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
  ]);

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">管理画面</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/inquiries"
          className="rounded-lg border p-6 hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">未読の問い合わせ</p>
          <p className="text-3xl font-bold">{unreadInquiryCount}</p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-lg border p-6 hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">登録ユーザー数</p>
          <p className="text-3xl font-bold">{userCount}</p>
        </Link>
      </div>
    </div>
  );
}
