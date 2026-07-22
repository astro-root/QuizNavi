import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { TournamentCard } from "@/components/tournaments/tournament-card";
import {
  Search,
  Calendar,
  MapPin,
  PlusCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [newTournaments, deadlineTournaments] = await Promise.all([
    prisma.tournament.findMany({
      where: { publishStatus: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.tournament.findMany({
      where: {
        publishStatus: "PUBLISHED",
        entryDeadline: { gte: new Date() },
      },
      orderBy: { entryDeadline: "asc" },
      take: 6,
    }),
  ]);

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
            QuizNaviは全国のクイズ大会を検索できるサービス。開催日、地域、参加資格、開催形式などで絞り込みできます。
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

      {newTournaments.length > 0 && (
        <section className="container py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              新着の大会
            </h2>
            <Link
              href="/tournaments"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              すべて見る
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newTournaments.map((tournament, i) => (
              <div
                key={tournament.id}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-both"
                style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
              >
                <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        </section>
      )}

      {deadlineTournaments.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="container py-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Calendar className="h-5 w-5 text-primary" />
                締切が近い大会
              </h2>
              <Link
                href="/tournaments?sort=deadline"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                すべて見る
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deadlineTournaments.map((tournament, i) => (
                <div
                  key={tournament.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 fill-mode-both"
                  style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                >
                  <TournamentCard tournament={tournament} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      <section className="border-t">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center sm:p-12">
            <PlusCircle className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 text-2xl font-bold">大会を主催していますか?</h2>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              QuizNaviなら無料で大会情報を掲載できます。登録は数分で完了し、
              公開前にいつでも内容を編集できます。まずは下書きから始めてみましょう。
            </p>
            <Button size="lg" className="transition-transform hover:-translate-y-0.5" asChild>
              <Link href="/organizer/tournaments/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                大会を登録する
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
