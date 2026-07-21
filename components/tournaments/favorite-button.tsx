"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/tournaments/_actions/favorites";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function FavoriteButton({
  tournamentId,
  slug,
  initialFavorited,
}: {
  tournamentId: string;
  slug: string;
  initialFavorited: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={initialFavorited ? "default" : "outline"}
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(() => toggleFavorite(tournamentId, slug))
      }
      className="transition-all active:scale-95"
    >
      <Heart
        className={`mr-2 h-4 w-4 transition-all ${
          initialFavorited ? "fill-current" : ""
        }`}
      />
      {initialFavorited ? "お気に入り済み" : "お気に入りに追加"}
    </Button>
  );
}
