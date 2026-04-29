"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type HelpContentProps = {
  title?: string;
  children: React.ReactNode;
};

type HelpPlacementProps = {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

type HelpBadgeProps = HelpContentProps &
  HelpPlacementProps & {
    className?: string;
    label?: string;
  };

type HelpTooltipProps = HelpPlacementProps & {
  title?: string;
  content: React.ReactNode;
  children: React.ReactElement;
};

function HelpBody({ title, children }: HelpContentProps) {
  return (
    <div className="flex flex-col gap-1.5 text-start">
      {title ? <span className="font-medium">{title}</span> : null}
      <span className="text-muted-foreground leading-6">{children}</span>
    </div>
  );
}

export function HelpBadge({
  title,
  children,
  side = "top",
  align = "center",
  className,
  label = "مساعدة",
}: HelpBadgeProps) {
  const isMobile = useIsMobile();
  const trigger = (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={cn(
        "bg-background text-muted-foreground hover:text-foreground shrink-0 rounded-full",
        className,
      )}
      aria-label={label}
    >
      <HugeiconsIcon icon={InformationCircleIcon} />
    </Button>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          className="border-primary/20 bg-card text-card-foreground max-w-80 shadow-lg"
        >
          <HelpBody title={title}>{children}</HelpBody>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="border-primary/20 bg-card text-card-foreground [&_svg]:fill-card [&_svg]:bg-card max-w-80 border px-4 py-3 text-sm shadow-lg"
        >
          <HelpBody title={title}>{children}</HelpBody>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function HelpTooltip({
  title,
  content,
  children,
  side = "top",
  align = "center",
}: HelpTooltipProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          className="border-primary/20 bg-card text-card-foreground max-w-80 shadow-lg"
        >
          <HelpBody title={title}>{content}</HelpBody>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="border-primary/20 bg-card text-card-foreground [&_svg]:fill-card [&_svg]:bg-card max-w-80 border px-4 py-3 text-sm shadow-lg"
        >
          <HelpBody title={title}>{content}</HelpBody>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
