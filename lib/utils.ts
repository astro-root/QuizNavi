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


export const PREFECTURE_LABELS: Record<string, string> = {
  HOKKAIDO: "北海道",
  AOMORI: "青森県",
  IWATE: "岩手県",
  MIYAGI: "宮城県",
  AKITA: "秋田県",
  YAMAGATA: "山形県",
  FUKUSHIMA: "福島県",
  IBARAKI: "茨城県",
  TOCHIGI: "栃木県",
  GUNMA: "群馬県",
  SAITAMA: "埼玉県",
  CHIBA: "千葉県",
  TOKYO: "東京都",
  KANAGAWA: "神奈川県",
  NIIGATA: "新潟県",
  TOYAMA: "富山県",
  ISHIKAWA: "石川県",
  FUKUI: "福井県",
  YAMANASHI: "山梨県",
  NAGANO: "長野県",
  GIFU: "岐阜県",
  SHIZUOKA: "静岡県",
  AICHI: "愛知県",
  MIE: "三重県",
  SHIGA: "滋賀県",
  KYOTO: "京都府",
  OSAKA: "大阪府",
  HYOGO: "兵庫県",
  NARA: "奈良県",
  WAKAYAMA: "和歌山県",
  TOTTORI: "鳥取県",
  SHIMANE: "島根県",
  OKAYAMA: "岡山県",
  HIROSHIMA: "広島県",
  YAMAGUCHI: "山口県",
  TOKUSHIMA: "徳島県",
  KAGAWA: "香川県",
  EHIME: "愛媛県",
  KOCHI: "高知県",
  FUKUOKA: "福岡県",
  SAGA: "佐賀県",
  NAGASAKI: "長崎県",
  KUMAMOTO: "熊本県",
  OITA: "大分県",
  MIYAZAKI: "宮崎県",
  KAGOSHIMA: "鹿児島県",
  OKINAWA: "沖縄県",
};

export const ELIGIBILITY_LEVEL_LABELS: Record<string, string> = {
  ANYONE: "どなたでも",
  MIDDLE_SCHOOL: "中学生",
  HIGH_SCHOOL: "高校生",
  MIDDLE_AND_HIGH: "中高生",
  BEGINNER_WELCOME: "初心者歓迎",
};

export const TAG_CATEGORY_LABELS: Record<string, string> = {
  FORMAT: "形式",
  TREND: "傾向",
  AUDIENCE: "対象",
  DIFFICULTY: "難易度",
  OTHER: "その他",
};
