"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TAG_CATEGORY_LABELS } from "@/lib/utils";

export type Tag = { id: string; name: string; category: string };

// シンプルなレーベンシュタイン距離(タグの表記ゆれ検出用)
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

type Props = {
  tags: Tag[];
  selectedTagIds: string[];
  onSelectedTagIdsChange: (ids: string[]) => void;
  newTagNames: string[];
  onNewTagNamesChange: (names: string[]) => void;
};

export function TagPicker({
  tags,
  selectedTagIds,
  onSelectedTagIdsChange,
  newTagNames,
  onNewTagNamesChange,
}: Props) {
  const [input, setInput] = useState("");

  const tagsByCategory = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    (acc[tag.category] ??= []).push(tag);
    return acc;
  }, {});

  const toggleTag = (tagId: string) => {
    onSelectedTagIdsChange(
      selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((id) => id !== tagId)
        : [...selectedTagIds, tagId]
    );
  };

  const suggestions = useMemo(() => {
    const query = input.trim();
    if (!query) return [];
    const lower = query.toLowerCase();
    return tags
      .filter((t) => !selectedTagIds.includes(t.id))
      .map((t) => {
        const name = t.name.toLowerCase();
        const distance = levenshtein(lower, name);
        const includes = name.includes(lower) || lower.includes(name);
        return { tag: t, distance, includes };
      })
      .filter(({ distance, includes }) => includes || distance <= 2)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((s) => s.tag);
  }, [input, tags, selectedTagIds]);

  const exactMatchExists = tags.some(
    (t) => t.name.toLowerCase() === input.trim().toLowerCase()
  );

  const handleAddNew = () => {
    const name = input.trim();
    if (!name) return;
    if (exactMatchExists) return;
    if (newTagNames.includes(name)) return;
    onNewTagNamesChange([...newTagNames, name]);
    setInput("");
  };

  const removeNewTag = (name: string) => {
    onNewTagNamesChange(newTagNames.filter((n) => n !== name));
  };

  return (
    <div className="space-y-4">
      {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
        <div key={category}>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {TAG_CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryTags.map((tag) => {
              const active = selectedTagIds.includes(tag.id);
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
        </div>
      ))}

      <div className="border-t pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          新しいタグを追加
        </p>

        {newTagNames.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {newTagNames.map((name) => (
              <Badge key={name} className="gap-1">
                {name}
                <button
                  type="button"
                  onClick={() => removeNewTag(name)}
                  className="ml-1 text-xs opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddNew();
              }
            }}
            placeholder="例: 早押し、アニメ、初心者向け"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddNew}
            disabled={!input.trim() || exactMatchExists}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2 animate-in fade-in-0 slide-in-from-top-1 space-y-1 duration-150">
            <p className="text-xs text-muted-foreground">似たタグがあります:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    toggleTag(tag.id);
                    setInput("");
                  }}
                >
                  <Badge variant="outline" className="cursor-pointer">
                    {tag.name} を使う
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
