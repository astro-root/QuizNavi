"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security/rate-limit";

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

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function submitInquiry(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const ip = await getClientIp();
  const { success } = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!success) {
    return {
      error: "送信回数が上限に達しました。しばらく時間をおいてから再度お試しください。",
    };
  }

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
