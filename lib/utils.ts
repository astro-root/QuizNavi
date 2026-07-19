import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_NAME = "QuizNavi";

export const REGION_LABELS: Record<string, string> = {
  HOKKAIDO: "北海道",
  TOHOKU: "東北",
  KANTO: "関東",
  CHUBU: "中部",
  KINKI: "近畿",
  CHUGOKU: "中国",
  SHIKOKU: "四国",
  KYUSHU_OKINAWA: "九州・沖縄",
  ONLINE_ONLY: "オンライン開催",
};

export const FORMAT_LABELS: Record<string, string> = {
  OFFLINE: "オフライン",
  ONLINE: "オンライン",
  HYBRID: "ハイブリッド",
};

export const STATUS_LABELS: Record<string, string> = {
  BEFORE_OPEN: "受付前",
  OPEN: "受付中",
  CLOSED: "締切",
  FINISHED: "開催終了",
  CANCELED: "中止",
  UPDATED: "更新あり",
};

export const STATUS_BADGE_STYLE: Record<string, string> = {
  BEFORE_OPEN: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  OPEN: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  CLOSED: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  FINISHED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  CANCELED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  UPDATED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
};

export function formatDateJa(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
