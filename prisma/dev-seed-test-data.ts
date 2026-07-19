import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test-organizer@example.com" },
    update: {},
    create: {
      authId: "00000000-0000-0000-0000-000000000001",
      email: "test-organizer@example.com",
      name: "テスト主催者",
      role: "ORGANIZER",
    },
  });

  const tags = await prisma.tag.findMany({
    where: { name: { in: ["個人戦", "早押し", "高校生歓迎"] } },
  });

  await prisma.tournament.upsert({
    where: { slug: "test-tournament-2026" },
    update: {},
    create: {
      slug: "test-tournament-2026",
      name: "第1回テストクイズ大会",
      organizerId: user.id,
      description: "動作確認用のテストデータです。",
      startAt: new Date("2026-09-15T10:00:00+09:00"),
      entryDeadline: new Date("2026-09-01T23:59:59+09:00"),
      format: "OFFLINE",
      region: "KANTO",
      prefecture: "TOKYO",
      city: "新宿区",
      venueName: "テスト会場ホール",
      capacity: 64,
      eligibility: "高校生以下",
      eligibilityLevel: "HIGH_SCHOOL",
      fee: "1000円",
      contact: "test-organizer@example.com",
      status: "OPEN",
      publishStatus: "PUBLISHED",
      tags: {
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
  });

  console.log("テストデータを投入しました:", "第1回テストクイズ大会");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
