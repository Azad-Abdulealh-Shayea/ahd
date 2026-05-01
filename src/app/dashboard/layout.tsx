import { type ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayoutClient } from "./dashboard-layout-client";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { db } from "@/server/db";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [currentUser, users] = await Promise.all([
    requireCurrentDemoUser(),
    db.demoUser.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <SidebarProvider dir="rtl" defaultOpen={true}>
      <DashboardLayoutClient currentUser={currentUser} users={users}>
        {children}
      </DashboardLayoutClient>
    </SidebarProvider>
  );
}
