import { SITE_NAME } from "@/lib/utils";
import { Search, Calendar, MapPin, PlusCircle, Heart, Globe } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  );
}


export const metadata = {
  title: "このサイトについて",
  description: "QuizNaviは全国のクイズ大会情報をまとめて検索できる情報サイトです。",
};

const FEATURES = [
  {
    icon: Search,
    title: "横断検索",
    body: "地域・開催形式・タグ・キーワードなど複数の条件を組み合わせて、目的の大会を素早く見つけられます。",
  },
  {
    icon: Calendar,
    title: "締切の可視化",
    body: "開催日や参加締切から受付状況を自動で判定し、今申し込めるかどうかが一目で分かります。",
  },
  {
    icon: MapPin,
    title: "地域から探せる",
    body: "都道府県・地方単位で大会を絞り込み、近くの大会をすぐに見つけられます。",
  },
  {
    icon: PlusCircle,
    title: "手軽な掲載",
    body: "主催者はGoogleアカウントでログインするだけで、数分で大会情報の下書きを作成できます。",
  },
  {
    icon: Heart,
    title: "お気に入り登録",
    body: "気になる大会をお気に入りに登録して、後から見返すことができます。",
  },
];

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold">このサイトについて</h1>

      <div className="mb-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {SITE_NAME} は、全国のクイズ大会情報をまとめて検索できる情報サイトです。
          オフライン・オンラインを問わず、様々な形式のクイズ大会の開催情報を掲載しています。
        </p>
        <p>
          「大会を探す側」にとっては、条件を絞り込んで自分に合った大会をすぐに見つけられることを、
          「大会を主催する側」にとっては、できるだけ手間をかけずに情報を公開できることを目指して開発しています。
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold">できること</h2>
      <div className="mb-10 space-y-4">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3 rounded-lg border p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">大会を掲載したい方へ</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          大会情報の登録に会員登録や審査は必要ありません。Googleアカウントでログイン後、
          「大会を登録する」フォームから必要な情報を入力すると、まず下書きとして保存されます。
        </p>
        <p>
          下書きの内容はいつでも編集でき、準備が整ったタイミングでご自身のペースで公開できます。
          公開後も内容の修正や、非公開への切り替えはいつでも行えます。
        </p>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">運営について</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          {SITE_NAME} は開発中のサービスです。掲載されている大会情報の正確性については、
          各大会の主催者情報や公式サイトも合わせてご確認ください。
        </p>
        <p>
          サービスに関するご意見・ご要望は「お問い合わせ」フォームからお寄せください。
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://astro-root.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Globe className="h-3.5 w-3.5" />
            公式サイト
          </a>
          <a
            href="https://x.com/root_qscore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <XIcon className="h-3.5 w-3.5" />
            公式X
          </a>
        </div>
      </div>
    </div>
  );
}
