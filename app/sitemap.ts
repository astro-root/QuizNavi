import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// ビルド時にDBへ問い合わせるとSupabase側の一時的な接続不調でビルド全体が失敗するため、
// リクエスト時に生成する(ビルドをDB接続に依存させない)。
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tournaments = await prisma.tournament.findMany({
    where: { publishStatus: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/tournaments`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/announcements`, changeFrequency: "daily", priority: 0.5 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const tournamentPages: MetadataRoute.Sitemap = tournaments.map((t) => ({
    url: `${siteUrl}/tournaments/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...tournamentPages];
}
