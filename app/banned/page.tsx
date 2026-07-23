import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

export default async function BannedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="container flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-destructive">
        アカウントが利用停止されています
      </h1>
      <p className="text-sm text-muted-foreground">
        このアカウントは運営により利用を停止されました。心当たりがない場合は「お問い合わせ」からご連絡ください。
      </p>
      <LogoutButton />
    </div>
  );
}
