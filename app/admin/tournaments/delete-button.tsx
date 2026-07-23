"use client";

import { useState, useTransition } from "react";
import { adminDeleteTournament } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteTournamentButton({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="text-destructive"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        削除
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() =>
          startTransition(() => adminDeleteTournament(tournamentId))
        }
      >
        本当に削除する
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => setConfirming(false)}
      >
        キャンセル
      </Button>
    </div>
  );
}
