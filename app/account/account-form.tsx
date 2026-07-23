"use client";

import { useActionState, useState, useTransition } from "react";
import {
  updateProfile,
  logout,
  deleteAccount,
  markNotificationRead,
  type AccountState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUploadField } from "@/components/organizer/file-upload-field";
import {
  LogOut,
  Trash2,
  Check,
  LayoutList,
  Heart,
  PlusCircle,
  Shield,
  Bell,
} from "lucide-react";
import Link from "next/link";

const initialState: AccountState = {};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

type Props = {
  user: { name: string; avatarUrl: string | null; email: string };
  isAdmin: boolean;
  notifications: NotificationItem[];
};

export function AccountForm({ user, isAdmin, notifications }: Props) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [, startMarkRead] = useTransition();

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

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Bell className="h-4 w-4" />
          お知らせ
        </h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">通知はありません</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-lg border p-4"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.isRead && (
                      <Badge className="text-xs">未読</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {n.createdAt}
                  </span>
                </div>
                <p className="mb-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {n.body}
                </p>
                {!n.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      startMarkRead(() => markNotificationRead(n.id))
                    }
                  >
                    既読にする
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isAdmin && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              管理画面へ
            </Link>
          </Button>
        )}
        <Button variant="outline" className="w-full" asChild>
          <Link href="/organizer/tournaments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            大会を登録する
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/organizer/tournaments">
            <LayoutList className="mr-2 h-4 w-4" />
            主催した大会を管理する
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/favorites">
            <Heart className="mr-2 h-4 w-4" />
            お気に入りの大会
          </Link>
        </Button>
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
