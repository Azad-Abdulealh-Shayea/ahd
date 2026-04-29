"use client";

import { useEffect, useState } from "react";
import {
  Cancel01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DismissibleNoticeProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const storagePrefix = "ahd:dismissed-notice:";

export function DismissibleNotice({
  id,
  title,
  children,
  className,
}: DismissibleNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(localStorage.getItem(`${storagePrefix}${id}`) !== "true");
  }, [id]);

  function dismiss() {
    localStorage.setItem(`${storagePrefix}${id}`, "true");
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <Alert className={cn("bg-background/70 backdrop-blur", className)}>
      <HugeiconsIcon icon={InformationCircleIcon} />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{children}</AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-xs" onClick={dismiss}>
          <HugeiconsIcon icon={Cancel01Icon} />
          <span className="sr-only">إغلاق</span>
        </Button>
      </AlertAction>
    </Alert>
  );
}
