"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markInquiryRead } from "./actions";

export function MarkReadButton({ inquiryId }: { inquiryId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => startTransition(() => markInquiryRead(inquiryId))}
    >
      既読にする
    </Button>
  );
}
