import { z } from "zod";

export const tagCategoryEnum = z.enum([
  "FORMAT",
  "TREND",
  "AUDIENCE",
  "DIFFICULTY",
  "OTHER",
]);

export const tagSchema = z.object({
  name: z.string().min(1, "タグ名は必須です").max(50),
  category: tagCategoryEnum,
});

export type TagFormValues = z.infer<typeof tagSchema>;
