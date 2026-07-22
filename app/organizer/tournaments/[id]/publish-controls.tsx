"use client";

import { useState, useTransition } from "react";
import {
  publishTournament,
  unpublishTournament,
  deleteTournament,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, ExternalLink, Pencil, AlertCircle } from "lucide-react";
import Link from "next/link";

const FIELD_LABELS: Record<string, string> = {
  name: "大会名",
  startAt: "開催日時",
  format: "開催形式",
  prefecture: "都道府県",
  eligibility: "参加資格",
  fee: "参加費",
  contact: "問い合わせ先",
};

export function PublishControls({
  tournamentId,
  publishStatus,
  slug,
}: {
  tournamentId: string;
  publishStatus: string;
  slug: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [publishError, setPublishError] = useState<{
    error?: string;
    fieldErrors?: Record<string, string>;
  } | null>(null);

  const handlePublish = () => {
    setPublishError(null);
    startTransition(async () => {
      const result = await publishTournament(tournamentId);
      if (result?.error) {
        setPublishError(result);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/tournaments/${slug}`} target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            大会ページを見る
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/organizer/tournaments/${tournamentId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            編集する
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        {publishStatus === "PUBLISHED" ? (
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              この大会は現在公開されています。誰でも大会ページを閲覧できます。
            </p>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() =>
                startTransition(() => unpublishTournament(tournamentId))
              }
            >
              <EyeOff className="mr-2 h-4 w-4" />
              下書きに戻す
            </Button>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              この大会はまだ公開されていません。準備ができたら公開しましょう。
            </p>

            {publishError && (
              <div className="mb-3 animate-in fade-in-0 slide-in-from-top-1 rounded-md bg-destructive/10 p-3 text-sm text-destructive duration-200">
                <div className="mb-1 flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  {publishError.error}
                </div>
                {publishError.fieldErrors && (
                  <ul className="ml-6 list-disc space-y-0.5 text-xs">
                    {Object.entries(publishError.fieldErrors).map(([key, msg]) => (
                      <li key={key}>
                        {FIELD_LABELS[key] ?? key}: {msg}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <Button
              disabled={pending}
              onClick={handlePublish}
              className="transition-transform active:scale-[0.98]"
            >
              <Eye className="mr-2 h-4 w-4" />
              {pending ? "処理中..." : "公開する"}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-destructive/30 p-5">
        <h2 className="mb-2 text-sm font-semibold text-destructive">
          大会の削除
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          この操作は取り消せません。
        </p>
        {!confirmingDelete ? (
          <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            削除する
          </Button>
        ) : (
          <div className="flex gap-2 animate-in fade-in-0 zoom-in-95 duration-150">
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(() => deleteTournament(tournamentId))
              }
            >
              本当に削除する
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => setConfirmingDelete(false)}
            >
              キャンセル
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
