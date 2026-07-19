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
export const eligibilityLevelEnum = z.enum([
  "ANYONE",
  "MIDDLE_SCHOOL",
  "HIGH_SCHOOL",
  "MIDDLE_AND_HIGH",
  "BEGINNER_WELCOME",
]);

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/.+/.test(v), {
    message: "有効なURLを入力してください",
  })
  .optional()
  .or(z.literal(""));

export const tournamentSchema = z
  .object({
    name: z.string().min(1, "大会名は必須です").max(200),
    description: z.string().max(5000).optional(),
    startAt: z.coerce.date({ error: "開催日時は必須です" }),
    endAt: z.coerce.date().optional(),
    entryDeadline: z.coerce.date().optional(),
    format: tournamentFormatEnum,
    region: regionEnum.optional(),
    prefecture: z.string().optional(),
    city: z.string().max(100).optional(),
    venueName: z.string().max(200).optional(),
    address: z.string().max(300).optional(),
    capacity: z.coerce.number().int().positive().optional(),
    eligibility: z.string().min(1, "参加資格は必須です").max(500),
    eligibilityLevel: eligibilityLevelEnum.default("ANYONE"),
    fee: z.string().min(1, "参加費は必須です").max(200),
    belongings: z.string().max(1000).optional(),
    contact: z.string().min(1, "問い合わせ先は必須です").max(300),
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
  })
  .refine(
    (data) => data.format === "ONLINE" || !!data.prefecture,
    {
      message: "オフライン/ハイブリッド開催の場合は都道府県が必須です",
      path: ["prefecture"],
    }
  );

export type TournamentFormValues = z.infer<typeof tournamentSchema>;
