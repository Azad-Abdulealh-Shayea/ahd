"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  File01Icon,
  HelpCircleIcon,
  Home01Icon,
  LegalDocument01Icon,
  Payment02Icon,
  Settings01Icon,
  Task01Icon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "الرئيسية",
    url: "/dashboard",
    icon: Home01Icon,
  },
  {
    title: "العقود",
    url: "/dashboard/contracts",
    icon: File01Icon,
  },
  {
    title: "إجراء مطلوب",
    url: "/dashboard/actions",
    icon: Task01Icon,
  },
  {
    title: "المدفوعات",
    url: "/dashboard/payments",
    icon: Payment02Icon,
  },
];

type AppSidebarProps = {
  currentUser: {
    name: string;
    roleLabel: string;
    initials: string;
  };
};

export function AppSidebar({ currentUser }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset" side="right">
      <SidebarHeader className="border-sidebar-border border-b p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={{ children: "عهد", side: "left" }}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/dashboard" aria-label="عهد">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={LegalDocument01Icon} />
                </div>
                <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-base font-semibold">عهد</span>
                  <span className="text-sidebar-foreground/70 truncate text-xs">
                    عقود ممولة
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>مساحة العمل</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === item.url
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={{ children: item.title, side: "left" }}
                    >
                      <Link href={item.url}>
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between gap-2 px-2 py-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="الإعدادات"
                  >
                    <HugeiconsIcon icon={Settings01Icon} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>الإعدادات</DialogTitle>
                    <DialogDescription>تفضيلات مساحة العمل.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 text-sm">
                    <ShellDialogLine label="اللغة" value="العربية" />
                    <ShellDialogLine label="الإشعارات" value="مفعلة" />
                    <ShellDialogLine label="العملة" value="SAR" />
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="المساعدة"
                  >
                    <HugeiconsIcon icon={HelpCircleIcon} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>كيف يعمل عهد؟</DialogTitle>
                    <DialogDescription>
                      نظرة سريعة تساعد العميل أو لجنة التحكيم على فهم مسار العقد
                      الممول.
                    </DialogDescription>
                  </DialogHeader>
                  <ol className="grid gap-3 text-sm">
                    {[
                      "أنشئ عقداً وحدد دور كل طرف.",
                      "قسّم العمل إلى مراحل ومعايير قبول واضحة.",
                      "يقبل الطرف الآخر العقد ويمول المرحلة.",
                      "يرسل مقدم الخدمة طلب الإنجاز.",
                      "يراجع الممول الطلب ويتم صرف الدفعة عند الاعتماد.",
                    ].map((item, index) => (
                      <li key={item} className="flex gap-3">
                        <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="leading-6">{item}</span>
                      </li>
                    ))}
                  </ol>
                </DialogContent>
              </Dialog>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: `${currentUser.name} · ${currentUser.roleLabel}`,
                side: "left",
              }}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <div className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {currentUser.initials}
              </div>
              <div className="flex min-w-0 flex-col text-start group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  {currentUser.name}
                </span>
                <span className="text-sidebar-foreground/70 truncate text-xs">
                  {currentUser.roleLabel}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action="/logout" method="post">
              <SidebarMenuButton
                type="submit"
                tooltip={{ children: "تبديل المستخدم", side: "left" }}
                className="group-data-[collapsible=icon]:justify-center"
              >
                <HugeiconsIcon icon={UserSwitchIcon} />
                <span>تبديل المستخدم</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function ShellDialogLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
