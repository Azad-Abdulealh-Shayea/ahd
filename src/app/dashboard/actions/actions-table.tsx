"use client";

import Link from "next/link";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { motion, pageStagger, subtleListItem } from "@/components/app/motion";
import { Button } from "@/components/ui/button";
import { formatSar, PaymentStatusBadge } from "@/features/contracts/display";
import {
  getNextAction,
  getOtherParty,
  getPrimaryMilestone,
  type ContractListItem,
} from "@/features/contracts/view-models";
import type { DemoUser } from "../../../../generated/prisma";

export function ActionsTable({
  data,
  currentUser,
}: {
  data: ContractListItem[];
  currentUser: DemoUser;
}) {
  const actionItems = data.filter((contract) => {
    const action = getNextAction(contract, currentUser);
    return (
      action.group === "fund" ||
      action.group === "review" ||
      action.group === "submit"
    );
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageStagger}
      className="border-y"
    >
      {actionItems.map((contract) => {
        const action = getNextAction(contract, currentUser);
        const milestone = getPrimaryMilestone(contract);
        const otherParty = getOtherParty(contract, currentUser);

        return (
          <motion.article
            key={contract.id}
            variants={subtleListItem}
            className="grid gap-3 border-b py-5 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{action.label}</span>
                {milestone ? (
                  <PaymentStatusBadge status={milestone.paymentStatus} />
                ) : null}
              </div>
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>{contract.title}</span>
                {milestone ? <span>{milestone.title}</span> : null}
                {otherParty ? <span>{otherParty.name}</span> : null}
                {milestone ? <span>{formatSar(milestone.amount)}</span> : null}
              </div>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href={action.href}>
                فتح
                <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-end" />
              </Link>
            </Button>
          </motion.article>
        );
      })}
      {!actionItems.length ? (
        <div className="text-muted-foreground py-12 text-center text-sm">
          لا توجد إجراءات مطلوبة.
        </div>
      ) : null}
    </motion.div>
  );
}
