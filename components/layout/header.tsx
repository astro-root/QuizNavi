"use client";
import Link from "next/link";
import { Search, Menu, Moon, Sun, Trophy, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SITE_NAME } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/tournaments", label: "大会を探す" },
  { href: "/tournaments?sort=deadline", label: "締切が近い大会" },
  { href: "/announcements", label: "お知らせ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/organizer/tournaments/new", label: "大会を登録する" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Trophy className="h-6 w-6 text-primary" />
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tournaments">
              <Search className="h-5 w-5" />
              <span className="sr-only">検索</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">テーマ切り替え</span>
          </Button>

          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              asChild
            >
              <Link href="/account">
                <Settings className="h-5 w-5" />
                <span className="sr-only">アカウント設定</span>
              </Link>
            </Button>
          ) : null}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="text-left text-base font-medium text-primary"
                  >
                    ログアウト
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-base font-medium text-primary"
                    onClick={() => setOpen(false)}
                  >
                    ログイン
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
