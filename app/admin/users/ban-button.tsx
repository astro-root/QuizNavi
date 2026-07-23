"use client";

import { useTransition } from "react";
import { toggleUserBan } from "./actions";
import { Button } from "@/components/ui/button";
import { Ban, Undo2 } from "lucide-react";

export function BanButton({
  userId,
  isBanned,
}: {
  userId: string;
  isBanned: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isBanned ? "outline" : "destructive"}
      disabled={pending}
      onClick={() => startTransition(() => toggleUserBan(userId, isBanned))}
    >
      {isBanned ? (
        <>
          <Undo2 className="mr-2 h-3.5 w-3.5" />
          BAN解除
        </>
      ) : (
        <>
          <Ban className="mr-2 h-3.5 w-3.5" />
          BANする
        </>
      )}
    </Button>
  );
}
