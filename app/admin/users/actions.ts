"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type NotifyState = {
  error?: string;
  success?: boolean;
};

export async function toggleUserBan(userId: string, currentlyBanned: boolean) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("権限がありません");

  if (admin.id === userId) {
    throw new Error("自分自身をBANすることはできません");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: !currentlyBanned },
  });

  revalidatePath("/admin/users");
}

export async function sendNotificationToUser(
  userId: string,
  _prevState: NotifyState,
  formData: FormData
): Promise<NotifyState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "権限がありません" };

  const title = formData.get("title")?.toString().trim() ?? "";
  const body = formData.get("body")?.toString().trim() ?? "";

  if (!title || !body) {
    return { error: "タイトルと本文を入力してください" };
  }

  await prisma.notification.create({
    data: { userId, title, body },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
