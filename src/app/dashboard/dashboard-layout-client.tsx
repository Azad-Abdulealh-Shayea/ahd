"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app/layout/app-sidebar";
import { DashboardHeader } from "@/components/app/layout/dashboard-header";
import { UserSwitchDialog } from "@/components/app/user-switch-dialog";
import { WelcomeDialog } from "@/components/app/welcome-dialog";
import type { DemoUser } from "../../../generated/prisma";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
  currentUser: DemoUser;
  users: DemoUser[];
};

export function DashboardLayoutClient({
  children,
  currentUser,
  users,
}: DashboardLayoutClientProps) {
  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);

  return (
    <>
      <AppSidebar
        currentUser={currentUser}
        onSwitchUser={() => setSwitchDialogOpen(true)}
      />
      <div className="bg-background @container/content m-1 ms-0 flex flex-1 flex-col rounded-2xl">
        <DashboardHeader currentUser={currentUser} />
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
      <UserSwitchDialog
        users={users}
        open={switchDialogOpen}
        onOpenChange={setSwitchDialogOpen}
      />
      <WelcomeDialog />
    </>
  );
}
