import type { TournamentStatus } from "@prisma/client";

type StatusInput = {
  startAt: Date | null;
  endAt: Date | null;
  entryDeadline: Date | null;
  status: TournamentStatus;
};

/**
 * 大会の受付ステータスを開催日時から動的に導出する。
 * CANCELED はDBの明示的な値を優先する(主催者が手動で設定するため、日時からは導出できない)。
 * それ以外は startAt / endAt / entryDeadline から常に再計算する。
 */
export function computeTournamentStatus(
  tournament: StatusInput,
  now: Date = new Date()
): TournamentStatus {
  if (tournament.status === "CANCELED") {
    return "CANCELED";
  }

  if (!tournament.startAt) {
    return "BEFORE_OPEN";
  }

  if (tournament.endAt && now > tournament.endAt) {
    return "FINISHED";
  }

  if (!tournament.endAt && now > tournament.startAt) {
    return "FINISHED";
  }

  if (tournament.entryDeadline && now > tournament.entryDeadline) {
    return "CLOSED";
  }

  return "OPEN";
}
