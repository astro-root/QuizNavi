import { z } from "zod";

export const tournamentFormatEnum = z.enum(["OFFLINE", "ONLINE", "HYBRID"]);
export const regionEnum = z.enum([
  "HOKKAIDO",
  "TOHOKU",
  "KANTO",
  "CHUBU",
  "KINKI",
  "CHUGOKU",
  "SHIKOKU",
  "KYUSHU_OKINAWA",
  "ONLINE_ONLY",
]);

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), {
    message: "有効なURLを入力してください",
  })
  .optional()
  .or(z.literal(""));

// 下書き保存時: 大会名以外はすべて任意。とりあえず保存できることを優先する。
export const tournamentDraftSchema = z.object({
  name: z.string().min(1, "大会名は必須です").max(200),
  description: z.string().max(5000).optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  entryDeadline: z.coerce.date().optional(),
  format: tournamentFormatEnum.optional(),
  region: regionEnum.optional(),
  prefecture: z.string().optional(),
  city: z.string().max(100).optional(),
  venueName: z.string().max(200).optional(),
  address: z.string().max(300).optional(),
  capacity: z.coerce.number().int().positive().optional(),
  eligibility: z.string().max(500).optional(),
  eligibilityLevel: z.string().max(100).optional(),
  fee: z.string().max(200).optional(),
  belongings: z.string().max(1000).optional(),
  contact: z.string().max(300).optional(),
  logoUrl: urlOrEmpty,
  timetableUrl: urlOrEmpty,
  questionTrend: z.string().max(2000).optional(),
  pdfUrl: urlOrEmpty,
  rulesUrl: urlOrEmpty,
  officialX: urlOrEmpty,
  officialSite: urlOrEmpty,
  entryFormUrl: urlOrEmpty,
  entryListUrl: urlOrEmpty,
  others: z.string().max(2000).optional(),
  tagIds: z.array(z.string().uuid()).default([]),
  newTagNames: z.array(z.string().min(1).max(50)).default([]),
});

export type TournamentDraftValues = z.infer<typeof tournamentDraftSchema>;

// 公開時: 参加者に必要な情報が揃っているかを厳格にチェックする。
export const publishRequirementsSchema = z
  .object({
    name: z.string().min(1, "大会名は必須です"),
    startAt: z.date({ error: "開催日時は必須です" }),
    format: tournamentFormatEnum,
    prefecture: z.string().nullable().optional(),
    eligibility: z.string().min(1, "参加資格は必須です"),
    fee: z.string().min(1, "参加費は必須です"),
    contact: z.string().min(1, "問い合わせ先は必須です"),
  })
  .refine((data) => data.format === "ONLINE" || !!data.prefecture, {
    message: "オフライン/ハイブリッド開催の場合は都道府県が必須です",
    path: ["prefecture"],
  });
