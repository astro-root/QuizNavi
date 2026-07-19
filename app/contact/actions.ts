"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inquirySchema = z.object({
  name: z.string().min(1, "お名前は必須です").max(100),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "内容は必須です").max(3000),
});

export type ContactState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function submitInquiry(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    subject: formData.get("subject")?.toString() || undefined,
    message: formData.get("message")?.toString() ?? "",
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "入力内容を確認してください", fieldErrors };
  }

  await prisma.inquiry.create({ data: parsed.data });

  return { success: true };
}
