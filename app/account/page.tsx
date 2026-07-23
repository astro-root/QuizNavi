import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container max-w-lg py-12">
      <h1 className="mb-8 text-2xl font-bold">アカウント設定</h1>
      <AccountForm
        user={{ name: user.name, avatarUrl: user.avatarUrl, email: user.email }}
        isAdmin={user.role === "ADMIN"}
        notifications={notifications.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          isRead: n.isRead,
          createdAt: n.createdAt.toLocaleDateString("ja-JP"),
        }))}
      />
    </div>
  );
}
