"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tournamentDraftSchema, publishRequirementsSchema } from "@/lib/validations/tournament";
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
    eligibilityLevel: formData.get("eligibilityLevel")?.toString() || undefined,
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
    tagIds: formData.getAll("tagIds").map((v) => v.toString()),
  };

  const parsed = tournamentDraftSchema.safeParse(raw);

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
      tags: {
        create: data.tagIds.map((tagId: string) => ({ tagId })),
      },
    },
  });

  redirect(`/organizer/tournaments?created=${tournament.id}`);
}

async function assertOwnership(tournamentId: string, userId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });
  if (!tournament || tournament.organizerId !== userId) {
    throw new Error("この大会を操作する権限がありません");
  }
  return tournament;
}

export type PublishState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function publishTournament(
  tournamentId: string
): Promise<PublishState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tournament = await assertOwnership(tournamentId, user.id);

  const parsed = publishRequirementsSchema.safeParse({
    name: tournament.name,
    startAt: tournament.startAt,
    format: tournament.format,
    prefecture: tournament.prefecture,
    eligibility: tournament.eligibility,
    fee: tournament.fee,
    contact: tournament.contact,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      error: "公開するには以下の項目を入力してください",
      fieldErrors,
    };
  }

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { publishStatus: "PUBLISHED" },
  });

  redirect(`/organizer/tournaments/${tournamentId}`);
}

export async function unpublishTournament(tournamentId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await assertOwnership(tournamentId, user.id);

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { publishStatus: "DRAFT" },
  });

  redirect(`/organizer/tournaments/${tournamentId}`);
}

export async function deleteTournament(tournamentId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await assertOwnership(tournamentId, user.id);

  await prisma.tournament.delete({ where: { id: tournamentId } });

  redirect("/organizer/tournaments");
}

export async function updateTournament(
  tournamentId: string,
  _prevState: CreateTournamentState,
  formData: FormData
): Promise<CreateTournamentState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/organizer/tournaments/${tournamentId}/edit`);
  }

  await assertOwnership(tournamentId, user.id);

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
    eligibilityLevel: formData.get("eligibilityLevel")?.toString() || undefined,
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
    tagIds: formData.getAll("tagIds").map((v) => v.toString()),
    newTagNames: formData.getAll("newTagNames").map((v) => v.toString()),
  };
  const parsed = tournamentDraftSchema.safeParse(raw);
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

  const createdTagIds: string[] = [];
  for (const name of data.newTagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, category: "OTHER" },
    });
    createdTagIds.push(tag.id);
  }
  const allTagIds = [...new Set([...data.tagIds, ...createdTagIds])];

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      name: data.name,
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
      tags: {
        create: allTagIds.map((tagId) => ({ tagId })),
        deleteMany: {},
      },
    },
  });

  redirect(`/organizer/tournaments/${tournamentId}?updated=1`);
}

export type ResultState = {
  error?: string;
  success?: boolean;
};

export async function updateTournamentResult(
  tournamentId: string,
  _prevState: ResultState,
  formData: FormData
): Promise<ResultState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await assertOwnership(tournamentId, user.id);

  const resultText = formData.get("resultText")?.toString().trim() || null;

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { resultText },
  });

  revalidatePath(`/tournaments`);
  revalidatePath(`/organizer/tournaments/${tournamentId}`);
  return { success: true };
}
