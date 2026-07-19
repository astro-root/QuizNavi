"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markInquiryRead(inquiryId: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("権限がありません");

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { isRead: true },
  });

  revalidatePath("/admin/inquiries");
}
