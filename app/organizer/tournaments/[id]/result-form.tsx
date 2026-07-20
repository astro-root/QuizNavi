"use client";

import { useActionState } from "react";
import { updateTournamentResult, type ResultState } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

const initialState: ResultState = {};

export function ResultForm({
  tournamentId,
  initialText,
}: {
  tournamentId: string;
  initialText: string;
}) {
  const action = updateTournamentResult.bind(null, tournamentId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold">大会結果</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        優勝者や順位など、大会の結果を記載できます。公開すると大会ページに表示されます。
      </p>

      {state.success && (
        <p className="mb-3 flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 animate-in fade-in-0 duration-200">
          <Check className="h-4 w-4" />
          保存しました
        </p>
      )}

      <form action={formAction} className="space-y-3">
        <Textarea
          name="resultText"
          rows={5}
          defaultValue={initialText}
          placeholder="例: 優勝は〇〇高校でした。準優勝は..."
        />
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "保存中..." : "結果を保存する"}
        </Button>
      </form>
    </div>
  );
}
