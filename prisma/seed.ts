import { PrismaClient, TagCategory } from "@prisma/client";

const prisma = new PrismaClient();

const TAGS: { name: string; category: TagCategory }[] = [
  { name: "個人戦", category: TagCategory.FORMAT },
  { name: "団体戦", category: TagCategory.FORMAT },
  { name: "早押し", category: TagCategory.FORMAT },
  { name: "筆記", category: TagCategory.FORMAT },
  { name: "ボード", category: TagCategory.FORMAT },
  { name: "時事", category: TagCategory.TREND },
  { name: "知識", category: TagCategory.TREND },
  { name: "アニメ・漫画", category: TagCategory.TREND },
  { name: "スポーツ", category: TagCategory.TREND },
  { name: "中学生歓迎", category: TagCategory.AUDIENCE },
  { name: "高校生歓迎", category: TagCategory.AUDIENCE },
  { name: "一般参加可", category: TagCategory.AUDIENCE },
  { name: "初心者歓迎", category: TagCategory.DIFFICULTY },
  { name: "経験者向け", category: TagCategory.DIFFICULTY },
  { name: "オンライン", category: TagCategory.OTHER },
  { name: "オフライン", category: TagCategory.OTHER },
];

async function main() {
  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }
  console.log("Seed完了:", TAGS.length, "件のタグを登録しました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
