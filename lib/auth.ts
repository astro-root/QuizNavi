import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User as PrismaUser } from "@prisma/client";
import { decodeEntitlements, hasPlan, type Entitlements, type PlanTier } from "@/lib/root-account/entitlements";

export async function getCurrentUser(): Promise<PrismaUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const existing = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });
  if (existing) {
    // BANされたアカウントは/bannedへ強制送客する(全ページ共通の関所)。
    if (existing.isBanned) {
      redirect("/banned");
    }
    return existing;
  }

  const email = authUser.email ?? `${authUser.id}@unknown.local`;
  const name =
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    email.split("@")[0];
  const avatarUrl =
    (authUser.user_metadata?.avatar_url as string | undefined) ?? null;

  return prisma.user.create({
    data: {
      authId: authUser.id,
      email,
      name,
      avatarUrl,
    },
  });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

/**
 * 現在のセッションのJWTから、Root Accountのプラン情報(学士/修士/博士)を取り出す。
 * DBへの追加問い合わせは発生しない(JWTのカスタムクレームを読むだけ)。
 * 未ログインの場合はnull。
 */
export async function getCurrentEntitlements(): Promise<Entitlements | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;
  return decodeEntitlements(session.access_token);
}

/**
 * 指定プラン以上を要求するガード。requireAdmin()と同じ使い方を想定。
 * 例: 大会作成をAI機能付きにする場合など、博士限定機能の入口で呼ぶ。
 *
 *   const entitlements = await requirePlan("doctor");
 *   if (!entitlements) redirect("/account?upgrade=doctor");
 */
export async function requirePlan(required: PlanTier): Promise<Entitlements | null> {
  const entitlements = await getCurrentEntitlements();
  if (!hasPlan(entitlements, required)) return null;
  return entitlements;
}
