"use client";

import { useActionState } from "react";
import { createAnnouncement, type AnnouncementState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Send } from "lucide-react";

const initialState: AnnouncementState = {};

export function AnnouncementForm() {
  const [state, formAction, pending] = useActionState(
    createAnnouncement,
    initialState
  );

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">新しいお知らせを投稿</h2>

      {state.success && (
        <p className="mb-4 flex items-center gap-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 animate-in fade-in-0 duration-200">
          <Check className="h-4 w-4" />
          投稿しました
        </p>
      )}
      {state.error && (
        <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in-0 duration-200">
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
        <Button type="submit" disabled={pending}>
          <Send className="mr-2 h-4 w-4" />
          {pending ? "投稿中..." : "投稿する"}
        </Button>
      </form>
    </div>
  );
}
