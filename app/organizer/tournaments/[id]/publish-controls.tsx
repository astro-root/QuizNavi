"use client";

import { useState, useTransition } from "react";
import {
  publishTournament,
  unpublishTournament,
  deleteTournament,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";

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
            <Button
              disabled={pending}
              onClick={() =>
                startTransition(() => publishTournament(tournamentId))
              }
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
