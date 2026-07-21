"use client";

import { useTransition } from "react";
import { toggleAnnouncementPublish, deleteAnnouncement } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export function AnnouncementRow({
  id,
  title,
  body,
  isPublished,
  createdAt,
}: {
  id: string;
  title: string;
  body: string;
  isPublished: boolean;
  createdAt: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          <Badge variant={isPublished ? "default" : "secondary"} className="text-xs">
            {isPublished ? "公開中" : "非公開"}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">{createdAt}</span>
      </div>
      <p className="mb-3 whitespace-pre-wrap text-sm text-muted-foreground">{body}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() =>
            startTransition(() => toggleAnnouncementPublish(id, isPublished))
          }
        >
          {isPublished ? (
            <>
              <EyeOff className="mr-2 h-3.5 w-3.5" />
              非公開にする
            </>
          ) : (
            <>
              <Eye className="mr-2 h-3.5 w-3.5" />
              公開する
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => startTransition(() => deleteAnnouncement(id))}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          削除
        </Button>
      </div>
    </div>
  );
}
