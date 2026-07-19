"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tournamentSchema } from "@/lib/validations/tournament";
import { sanitizeUrl } from "@/lib/security/sanitize";

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ぁ-んァ-ヶ一-龠ー\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "tournament"}-${suffix}`;
}

const URL_FIELDS = [
  "logoUrl",
  "timetableUrl",
  "pdfUrl",
  "rulesUrl",
  "officialX",
  "officialSite",
  "entryFormUrl",
  "entryListUrl",
] as const;

export type CreateTournamentState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createTournamentDraft(
  _prevState: CreateTournamentState,
  formData: FormData
): Promise<CreateTournamentState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/organizer/tournaments/new");
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() || undefined,
    startAt: formData.get("startAt")?.toString() ?? "",
    endAt: formData.get("endAt")?.toString() || undefined,
    entryDeadline: formData.get("entryDeadline")?.toString() || undefined,
    format: formData.get("format")?.toString() ?? "",
    region: formData.get("region")?.toString() || undefined,
    prefecture: formData.get("prefecture")?.toString() || undefined,
    city: formData.get("city")?.toString() || undefined,
    venueName: formData.get("venueName")?.toString() || undefined,
    address: formData.get("address")?.toString() || undefined,
    capacity: formData.get("capacity")?.toString() || undefined,
    eligibility: formData.get("eligibility")?.toString() ?? "",
    eligibilityLevel: formData.get("eligibilityLevel")?.toString() || "ANYONE",
    fee: formData.get("fee")?.toString() ?? "",
    belongings: formData.get("belongings")?.toString() || undefined,
    contact: formData.get("contact")?.toString() ?? "",
    logoUrl: formData.get("logoUrl")?.toString() ?? "",
    timetableUrl: formData.get("timetableUrl")?.toString() ?? "",
    questionTrend: formData.get("questionTrend")?.toString() || undefined,
    pdfUrl: formData.get("pdfUrl")?.toString() ?? "",
    rulesUrl: formData.get("rulesUrl")?.toString() ?? "",
    officialX: formData.get("officialX")?.toString() ?? "",
    officialSite: formData.get("officialSite")?.toString() ?? "",
    entryFormUrl: formData.get("entryFormUrl")?.toString() ?? "",
    entryListUrl: formData.get("entryListUrl")?.toString() ?? "",
    others: formData.get("others")?.toString() || undefined,
    tagIds: [] as string[],
  };

  const parsed = tournamentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "入力内容を確認してください", fieldErrors };
  }

  const data = parsed.data;

  const sanitizedUrls: Record<string, string | null> = {};
  for (const field of URL_FIELDS) {
    const value = data[field];
    sanitizedUrls[field] = value ? sanitizeUrl(value) : null;
  }

  const tournament = await prisma.tournament.create({
    data: {
      slug: slugify(data.name),
      name: data.name,
      organizerId: user.id,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
      entryDeadline: data.entryDeadline,
      format: data.format,
      region: data.region,
      prefecture: data.prefecture as never,
      city: data.city,
      venueName: data.venueName,
      address: data.address,
      capacity: data.capacity,
      eligibility: data.eligibility,
      eligibilityLevel: data.eligibilityLevel,
      fee: data.fee,
      belongings: data.belongings,
      contact: data.contact,
      logoUrl: sanitizedUrls.logoUrl,
      timetableUrl: sanitizedUrls.timetableUrl,
      questionTrend: data.questionTrend,
      pdfUrl: sanitizedUrls.pdfUrl,
      rulesUrl: sanitizedUrls.rulesUrl,
      officialX: sanitizedUrls.officialX,
      officialSite: sanitizedUrls.officialSite,
      entryFormUrl: sanitizedUrls.entryFormUrl,
      entryListUrl: sanitizedUrls.entryListUrl,
      others: data.others,
      publishStatus: "DRAFT",
    },
  });

  redirect(`/organizer/tournaments?created=${tournament.id}`);
}
