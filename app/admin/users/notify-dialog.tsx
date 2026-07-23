"use client";

import { useActionState, useState } from "react";
import { sendNotificationToUser, type NotifyState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Check, Send } from "lucide-react";

const initialState: NotifyState = {};

export function NotifyDialog({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const sendWithId = sendNotificationToUser.bind(null, userId);
  const [state, formAction, pending] = useActionState(
    sendWithId,
    initialState
  );
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Bell className="mr-2 h-3.5 w-3.5" />
          通知を送る
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userName} さんに通知を送る</DialogTitle>
        </DialogHeader>

        {state.success && (
          <p className="flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600">
            <Check className="h-4 w-4" />
            送信しました
          </p>
        )}
        {state.error && (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">本文</Label>
            <Textarea id="body" name="body" rows={4} required />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {pending ? "送信中..." : "送信する"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
