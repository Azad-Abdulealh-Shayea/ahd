"use client";

import type { ComponentProps } from "react";
import { CopyLinkIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyInviteLinkButton({
  inviteToken,
  label = "نسخ رابط الدعوة",
  size = "sm",
  variant = "outline",
}: {
  inviteToken: string;
  label?: string;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
}) {
  async function copyInviteLink() {
    try {
      const inviteLink = `${window.location.origin}/contracts/invite/${inviteToken}`;

      await navigator.clipboard.writeText(inviteLink);
      toast.success("تم نسخ رابط الدعوة");
    } catch {
      toast.error("تعذر نسخ رابط الدعوة");
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={copyInviteLink}
    >
      <HugeiconsIcon icon={CopyLinkIcon} data-icon="inline-start" />
      {label}
    </Button>
  );
}
