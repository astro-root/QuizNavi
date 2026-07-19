import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            全国のクイズ大会を、
            <br className="md:hidden" />
            もっと簡単に見つけよう
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
            QuizNaviは中学生・高校生のためのクイズ大会検索サービス。開催日、地域、参加資格、問題傾向など、あなたにぴったりの大会を見つけられます。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/tournaments">
                <Search className="mr-2 h-5 w-5" />
                大会を探す
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/organizer/tournaments/new">大会を登録する</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">複数条件で検索</h3>
          <p className="text-sm text-muted-foreground">
            地域、開催形式、タグ、参加費など多彩な条件で絞り込み検索ができます。
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">締切が一目でわかる</h3>
          <p className="text-sm text-muted-foreground">
            受付状況・締切日を色分けして表示。参加できるかすぐに判断できます。
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">地域から探せる</h3>
          <p className="text-sm text-muted-foreground">
            都道府県・地方単位で大会を絞り込み、近くの大会をすぐに見つけられます。
          </p>
        </div>
      </section>
    </div>
  );
}
