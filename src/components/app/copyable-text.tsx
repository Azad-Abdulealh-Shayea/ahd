"use client";

import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyableTextProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyableText({ value, label, className }: CopyableTextProps) {
  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("تم النسخ");
    } catch {
      toast.error("تعذر النسخ");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className={cn(
        "h-auto min-w-0 justify-start px-0 py-0 text-xs",
        className,
      )}
      onClick={copyValue}
      title={`نسخ ${label ?? value}`}
    >
      <span className="truncate">{label ?? value}</span>
      <HugeiconsIcon icon={Copy01Icon} data-icon="inline-end" />
    </Button>
  );
}
