"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft02Icon,
  MoneySecurityIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import type { DemoUser } from "../../../generated/prisma";

type UserSwitchDialogProps = {
  users: DemoUser[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserSwitchDialog({
  users,
  open,
  onOpenChange,
}: UserSwitchDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSwitch = async (userId: string) => {
    setLoading(userId);
    try {
      const res = await fetch("/login/select", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const user = users.find((u) => u.id === userId);
        router.refresh();
        onOpenChange(false);
        toast.success(`تم تبديل إلى ${user?.name ?? "الحساب"}`);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={UserSwitchIcon} />
            تبديل المستخدم
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {users.map((user) => {
            const isProvider = user.role === "PROVIDER";
            const isLoading = loading === user.id;

            return (
              <div
                key={user.id}
                className="hover:bg-accent hover:bg-opacity-50 flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors"
                onClick={() => !isLoading && handleSwitch(user.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-semibold">
                      {user.initials}
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {user.englishName}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={
                      isProvider
                        ? "bg-success text-success-foreground"
                        : "bg-funded text-funded-foreground"
                    }
                  >
                    {user.roleLabel}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {user.organization}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleSwitch(user.id);
                    }}
                  >
                    دخول
                    <HugeiconsIcon
                      icon={isProvider ? ArrowLeft02Icon : MoneySecurityIcon}
                      data-icon="inline-end"
                    />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
