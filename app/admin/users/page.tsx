import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ROLE_LABEL: Record<string, string> = {
  USER: "一般",
  ORGANIZER: "主催者",
  ADMIN: "管理者",
};

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">ユーザー一覧</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">名前</th>
              <th className="p-3">メール</th>
              <th className="p-3">権限</th>
              <th className="p-3">登録日</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{ROLE_LABEL[u.role] ?? u.role}</td>
                <td className="p-3">{u.createdAt.toLocaleDateString("ja-JP")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
