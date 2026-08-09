import { getCurrentEntitlements } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const PLAN_LABEL: Record<string, string> = {
  bachelor: "学士",
  master: "修士",
  doctor: "博士",
};

const ACCOUNTS_URL = process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "https://accounts.astro-root.com";

export async function RootAccountSection() {
  const entitlements = await getCurrentEntitlements();
  const plan = entitlements?.plan ?? "bachelor";

  return (
    <div className="mb-6 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">るーとの研究室アカウント</h2>
        <Badge variant="secondary">{PLAN_LABEL[plan] ?? plan}プラン</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        プロフィール・研究ポイント・プランの変更は、るーとの研究室の共通アカウント画面から
        行えます（Q-Mark・めくるなど他サービスとも共通です）。
      </p>
      <a
        href={`${ACCOUNTS_URL}/profile`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        アカウント設定を開く
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
