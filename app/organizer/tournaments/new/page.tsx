import { prisma } from "@/lib/prisma";
import { NewTournamentForm } from "./new-form";

export default async function NewTournamentPage() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return <NewTournamentForm tags={tags} />;
}
