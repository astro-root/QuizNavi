"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { REGION_LABELS, FORMAT_LABELS } from "@/lib/utils";

type Tag = { id: string; name: string; category: string };

export function TournamentFilters({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const currentTagIds = searchParams.getAll("tag");

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const toggleTag = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("tag");
    params.delete("tag");
    if (current.includes(tagId)) {
      current.filter((t) => t !== tagId).forEach((t) => params.append("tag", t));
    } else {
      [...current, tagId].forEach((t) => params.append("tag", t));
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: q || null });
  };

  const hasActiveFilters =
    searchParams.get("region") ||
    searchParams.get("format") ||
    currentTagIds.length > 0 ||
    searchParams.get("q");

  return (
    <div className="mb-8 space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="大会名で検索"
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          検索
        </Button>
      </form>

      <div className="flex flex-wrap gap-3">
        <Select
          value={searchParams.get("region") ?? "ALL"}
          onValueChange={(v) => updateParams({ region: v === "ALL" ? null : v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="地域" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">すべての地域</SelectItem>
            {Object.entries(REGION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("format") ?? "ALL"}
          onValueChange={(v) => updateParams({ format: v === "ALL" ? null : v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="開催形式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">すべての形式</SelectItem>
            {Object.entries(FORMAT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            条件をクリア
          </Button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t pt-4">
          {tags.map((tag) => {
            const active = currentTagIds.includes(tag.id);
            return (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}>
                <Badge
                  variant={active ? "default" : "secondary"}
                  className="cursor-pointer transition-colors"
                >
                  {tag.name}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
