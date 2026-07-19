import Link from "next/link";
import { SITE_NAME } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <p className="font-bold text-base mb-2">{SITE_NAME}</p>
          <p className="text-muted-foreground">
            全国のクイズ大会情報をまとめて検索できるサービスです。
          </p>
        </div>
        <div>
          <p className="font-semibold mb-2">大会を探す</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link href="/tournaments">大会一覧</Link></li>
            <li><Link href="/tournaments?status=OPEN">受付中の大会</Link></li>
            <li><Link href="/tournaments?format=ONLINE">オンライン大会</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">主催者の方へ</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link href="/organizer/tournaments/new">大会を登録する</Link></li>
            <li><Link href="/organizer/tournaments">主催大会の管理</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">サイト情報</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link href="/about">このサイトについて</Link></li>
            <li><Link href="/terms">利用規約</Link></li>
            <li><Link href="/privacy">プライバシーポリシー</Link></li>
          </ul>
        </div>
      </div>
      <div className="container py-4 border-t text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
