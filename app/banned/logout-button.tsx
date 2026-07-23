"use client";

import { logout } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button variant="outline" onClick={() => logout()}>
      <LogOut className="mr-2 h-4 w-4" />
      ログアウト
    </Button>
  );
}
