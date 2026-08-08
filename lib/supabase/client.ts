import { createBrowserClient } from "@supabase/ssr";

// QuizNavi独自のSupabaseプロジェクトではなく、るーとの研究室 Root Accountの
// Supabaseプロジェクトを参照する。cookieのdomainを ".astro-root.com" にすることで
// Root Account(accounts.astro-root.com)でのログインセッションをQuizNavi側でも
// そのまま利用できる(サブドメイン間SSO)。
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_ROOT_ACCOUNT_URL!,
    process.env.NEXT_PUBLIC_ROOT_ACCOUNT_ANON_KEY!,
    {
      cookieOptions: {
        domain: process.env.NEXT_PUBLIC_ROOT_ACCOUNT_COOKIE_DOMAIN,
        path: "/",
        sameSite: "lax",
        secure: true,
      },
    }
  );
}
