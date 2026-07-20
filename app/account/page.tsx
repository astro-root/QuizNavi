import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="container max-w-lg py-12">
      <h1 className="mb-8 text-2xl font-bold">アカウント設定</h1>
      <AccountForm
        user={{ name: user.name, avatarUrl: user.avatarUrl, email: user.email }}
      />
    </div>
  );
}
