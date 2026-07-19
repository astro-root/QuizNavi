"use client";

import { useActionState } from "react";
import { submitInquiry, type ContactState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

const initialState: ContactState = {};

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState
  );

  if (state.success) {
    return (
      <div className="container flex min-h-[70vh] max-w-lg flex-col items-center justify-center py-20 text-center animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">送信しました</h1>
        <p className="text-muted-foreground">
          お問い合わせいただきありがとうございます。内容を確認のうえ、必要に応じてご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">お問い合わせ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ご質問・ご要望などお気軽にお送りください
        </p>
      </div>

      {state.error && (
        <p className="mb-4 animate-in fade-in-0 slide-in-from-top-1 rounded-md bg-destructive/10 p-3 text-sm text-destructive duration-200">
          {state.error}
        </p>
      )}

      <form
        action={formAction}
        className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="name">
            お名前 <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" required />
          {state.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            メールアドレス <span className="text-destructive">*</span>
          </Label>
          <Input id="email" type="email" name="email" required />
          {state.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">件名</Label>
          <Input id="subject" name="subject" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            お問い合わせ内容 <span className="text-destructive">*</span>
          </Label>
          <Textarea id="message" name="message" rows={6} required />
          {state.fieldErrors?.message && (
            <p className="text-xs text-destructive">{state.fieldErrors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full transition-transform active:scale-[0.98]"
        >
          {pending ? (
            "送信中..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              送信する
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
