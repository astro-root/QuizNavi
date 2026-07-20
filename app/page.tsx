import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container py-20 text-center md:py-28">
          <h1 className="mb-4 animate-in fade-in-0 slide-in-from-bottom-4 text-3xl font-bold tracking-tight duration-700 md:text-5xl">
            全国のクイズ大会を、
            <br className="md:hidden" />
            もっと簡単に見つけよう
          </h1>
          <p className="mx-auto mb-8 max-w-2xl animate-in fade-in-0 slide-in-from-bottom-4 text-base text-muted-foreground duration-700 [animation-delay:100ms] fill-mode-both md:text-lg">
            QuizNaviは全国のクイズ大会を検索できるサービス。開催日、地域、参加資格、問題傾向など、あなたにぴったりの大会を見つけられます。
          </p>
          <div className="flex animate-in fade-in-0 slide-in-from-bottom-4 flex-col items-center justify-center gap-3 duration-700 [animation-delay:200ms] fill-mode-both sm:flex-row">
            <Button size="lg" className="transition-transform hover:-translate-y-0.5 active:translate-y-0" asChild>
              <Link href="/tournaments">
                <Search className="mr-2 h-5 w-5" />
                大会を探す
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-transform hover:-translate-y-0.5 active:translate-y-0"
              asChild
            >
              <Link href="/organizer/tournaments/new">大会を登録する</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container grid grid-cols-1 gap-8 py-16 md:grid-cols-3">
        {[
          {
            icon: Search,
            title: "複数条件で検索",
            body: "地域、開催形式、タグ、参加費など多彩な条件で絞り込み検索ができます。",
          },
          {
            icon: Calendar,
            title: "締切が一目でわかる",
            body: "受付状況・締切日を色分けして表示。参加できるかすぐに判断できます。",
          },
          {
            icon: MapPin,
            title: "地域から探せる",
            body: "都道府県・地方単位で大会を絞り込み、近くの大会をすぐに見つけられます。",
          },
        ].map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className="animate-in fade-in-0 slide-in-from-bottom-2 rounded-xl p-4 text-center transition-all duration-500 fill-mode-both hover:-translate-y-1 hover:bg-muted/40"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
