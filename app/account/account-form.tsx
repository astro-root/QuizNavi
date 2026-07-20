"use client";

import { useActionState, useState } from "react";
import { updateProfile, logout, deleteAccount, type AccountState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadField } from "@/components/organizer/file-upload-field";
import { LogOut, Trash2, Check } from "lucide-react";

const initialState: AccountState = {};

type Props = {
  user: { name: string; avatarUrl: string | null; email: string };
};

export function AccountForm({ user }: Props) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteAccount();
    if (result?.error) {
      setDeleteError(result.error);
      setConfirmingDelete(false);
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="mb-6 text-sm text-muted-foreground">{user.email}</p>

        {state.success && (
          <p className="mb-4 flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 animate-in fade-in-0 slide-in-from-top-1 duration-200">
            <Check className="h-4 w-4" />
            プロフィールを更新しました
          </p>
        )}
        {state.error && (
          <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
            {state.error}
          </p>
        )}

        <form action={formAction} className="space-y-5">
          <FileUploadField
            label="アバター画像"
            name="avatarUrl"
            bucket="tournament-logos"
            accept="image/*"
            kind="image"
          />

          <div className="space-y-2">
            <Label htmlFor="name">表示名</Label>
            <Input id="name" name="name" defaultValue={user.name} required />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full transition-transform active:scale-[0.98]"
          >
            {pending ? "保存中..." : "保存する"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl border p-6">
        <Button variant="outline" className="w-full" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </div>

      <div className="rounded-xl border border-destructive/30 p-6">
        <h2 className="mb-2 text-sm font-semibold text-destructive">
          アカウントの削除
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          この操作は取り消せません。主催中の大会が残っている場合は削除できません。
        </p>

        {deleteError && (
          <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in-0 duration-200">
            {deleteError}
          </p>
        )}

        {!confirmingDelete ? (
          <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            アカウントを削除する
          </Button>
        ) : (
          <div className="flex gap-2 animate-in fade-in-0 zoom-in-95 duration-150">
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting ? "削除中..." : "本当に削除する"}
            </Button>
            <Button
              variant="outline"
              disabled={deleting}
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
