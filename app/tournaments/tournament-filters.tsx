"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { REGION_LABELS, FORMAT_LABELS } from "@/lib/utils";

export function TournamentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [tagQuery, setTagQuery] = useState(searchParams.get("tagQuery") ?? "");
  const [feeMin, setFeeMin] = useState(searchParams.get("feeMin") ?? "");
  const [feeMax, setFeeMax] = useState(searchParams.get("feeMax") ?? "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") ?? "");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      q: q || null,
      tagQuery: tagQuery || null,
      feeMin: feeMin || null,
      feeMax: feeMax || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    });
  };

  const handleClear = () => {
    setQ("");
    setTagQuery("");
    setFeeMin("");
    setFeeMax("");
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    searchParams.get("region") ||
      searchParams.get("format") ||
      searchParams.get("q") ||
      searchParams.get("tagQuery") ||
      searchParams.get("feeMin") ||
      searchParams.get("feeMax") ||
      searchParams.get("dateFrom") ||
      searchParams.get("dateTo")
  );

  return (
    <div className="mb-8 space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="大会名で検索"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={searchParams.get("region") ?? "ALL"}
            onValueChange={(v) => updateParams({ region: v === "ALL" ? null : v })}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
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
            <SelectTrigger className="w-full sm:w-[160px]">
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

          <Input
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
            placeholder="タグで検索(例: 早押し)"
            className="w-full sm:w-[200px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-4 sm:flex sm:flex-wrap">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">開催日(から)</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full sm:w-[160px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">開催日(まで)</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full sm:w-[160px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">参加費(下限・円)</label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={feeMin}
              onChange={(e) => setFeeMin(e.target.value)}
              placeholder="例: 0"
              className="w-full sm:w-[120px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">参加費(上限・円)</label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={feeMax}
              onChange={(e) => setFeeMax(e.target.value)}
              placeholder="例: 1000"
              className="w-full sm:w-[120px]"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          参加費での絞り込みは「1000円」のように半角数字+円のみで登録された大会が対象です。
        </p>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isPending}>
            検索
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              条件をクリア
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
