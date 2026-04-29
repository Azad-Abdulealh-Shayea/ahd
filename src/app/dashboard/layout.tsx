import { type ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/layout/app-sidebar";
import { DashboardHeader } from "@/components/app/layout/dashboard-header";
import { requireCurrentDemoUser } from "@/server/demo-session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await requireCurrentDemoUser();

  return (
    <SidebarProvider dir="rtl">
      <AppSidebar currentUser={currentUser} />
      <SidebarInset className="bg-background @container/content">
        <DashboardHeader currentUser={currentUser} />
        <main className="px-4 py-6 md:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
