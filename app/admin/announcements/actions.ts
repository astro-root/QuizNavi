"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AnnouncementState = {
  error?: string;
  success?: boolean;
};

export async function createAnnouncement(
  _prevState: AnnouncementState,
  formData: FormData
): Promise<AnnouncementState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "権限がありません" };

  const title = formData.get("title")?.toString().trim() ?? "";
  const body = formData.get("body")?.toString().trim() ?? "";

  if (!title || !body) {
    return { error: "タイトルと本文を入力してください" };
  }

  await prisma.announcement.create({
    data: {
      title,
      body,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  return { success: true };
}

export async function toggleAnnouncementPublish(
  id: string,
  currentlyPublished: boolean
) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("権限がありません");

  await prisma.announcement.update({
    where: { id },
    data: {
      isPublished: !currentlyPublished,
      publishedAt: !currentlyPublished ? new Date() : null,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
}

export async function deleteAnnouncement(id: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("権限がありません");

  await prisma.announcement.delete({ where: { id } });

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
}
