import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MarkReadButton } from "./mark-read-button";

export const metadata = {
  title: "お問い合わせ管理",
};

export default async function AdminInquiriesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-2xl font-bold">お問い合わせ一覧</h1>

      {inquiries.length === 0 ? (
        <p className="text-muted-foreground">お問い合わせはまだありません。</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {inquiry.subject || "(件名なし)"}
                    {!inquiry.isRead && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        未読
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.name} ({inquiry.email}) ・
                    {inquiry.createdAt.toLocaleString("ja-JP")}
                  </p>
                </div>
                {!inquiry.isRead && <MarkReadButton inquiryId={inquiry.id} />}
              </div>
              <p className="whitespace-pre-wrap text-sm">{inquiry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
