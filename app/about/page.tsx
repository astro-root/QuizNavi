import { SITE_NAME } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold">このサイトについて</h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {SITE_NAME} は、全国のクイズ大会情報をまとめて検索できる情報サイトです。
          オフライン・オンラインを問わず、様々な形式のクイズ大会の開催情報を掲載しています。
        </p>
        <p>
          主催者の方はどなたでも大会情報を登録できます。掲載をご希望の場合は、
          「大会を登録する」からお申し込みください。
        </p>
      </div>
    </div>
  );
}
