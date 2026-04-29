"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown01Icon,
  FileEditIcon,
  FilePlusIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  currentUser: {
    name: string;
    role?: string;
    roleLabel: string;
  };
};

export function DashboardHeader({ currentUser }: DashboardHeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });

    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "peer/header sticky top-0 z-50 h-16 w-[inherit]",
        offset > 10 ? "shadow-sm" : "shadow-none",
      )}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 p-4 sm:gap-4",
          offset > 10 &&
            "after:bg-background/40 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg",
        )}
      >
        <SidebarTrigger variant="outline" className="ms-2 max-md:scale-110" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="truncate text-sm font-semibold">لوحة القيادة</h1>
            <div className="hidden items-center gap-2 sm:flex">
              <Badge variant="secondary">{currentUser.roleLabel}</Badge>
              <span className="text-muted-foreground truncate text-xs">
                {currentUser.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
                  إنشاء عقد
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    data-icon="inline-end"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="gap-2.5 py-2.5" asChild>
                    <Link href="/dashboard/contracts/new/manual">
                      <HugeiconsIcon icon={FilePlusIcon} />
                      <span>إنشاء يدوي</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2.5 py-2.5" asChild>
                    <Link href="/dashboard/contracts/new/wizard/role">
                      <HugeiconsIcon icon={FileEditIcon} />
                      <span>خطوة بخطوة</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
