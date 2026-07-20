"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export type AccountState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prevState: AccountState,
  formData: FormData
): Promise<AccountState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = formData.get("name")?.toString().trim() ?? "";
  const avatarUrl = formData.get("avatarUrl")?.toString() || null;

  if (!name) {
    return { error: "表示名を入力してください" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, avatarUrl },
  });

  revalidatePath("/account");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteAccount(): Promise<AccountState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tournamentCount = await prisma.tournament.count({
    where: { organizerId: user.id },
  });
  if (tournamentCount > 0) {
    return {
      error:
        "主催中の大会が残っているため削除できません。先に大会を削除してください。",
    };
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await prisma.user.delete({ where: { id: user.id } });
  await supabaseAdmin.auth.admin.deleteUser(user.authId);

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}
