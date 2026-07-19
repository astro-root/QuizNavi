"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="container flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold">ログイン</h1>
        <p className="text-sm text-muted-foreground">
          Googleアカウントでログインしてください
        </p>
        <Button onClick={handleGoogleLogin} className="w-full" size="lg">
          Googleでログイン
        </Button>
      </div>
    </div>
  );
}
