"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { motion } from "@/components/app/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSar, PaymentStatusBadge } from "@/features/contracts/display";
import {
  getCurrentUserParty,
  getParty,
  type ContractListItem,
} from "@/features/contracts/view-models";
import type { DemoUser, Milestone } from "../../../../generated/prisma";

export function PaymentsTable({
  data,
  currentUser,
}: {
  data: ContractListItem[];
  currentUser: DemoUser;
}) {
  const [search, setSearch] = useState("");
  const paymentRows = useMemo(
    () =>
      data.flatMap((contract) =>
        contract.milestones.map((milestone) => ({ contract, milestone })),
      ),
    [data],
  );
  const filteredRows = paymentRows.filter(({ contract, milestone }) =>
    [contract.title, milestone.title]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full max-w-sm">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <HugeiconsIcon icon={Search01Icon} />
        </div>
        <Input
          type="search"
          placeholder="ابحث بالعقد أو المرحلة…"
          className="ps-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="overflow-hidden border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المرحلة</TableHead>
              <TableHead>العقد</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead className="text-end">إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map(({ contract, milestone }, index) => (
              <motion.tr
                key={`${contract.id}-${milestone.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.24,
                  delay: Math.min(index * 0.035, 0.18),
                }}
                className="hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
              >
                <TableCell className="font-medium">{milestone.title}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/contracts/${contract.id}`}
                    className="hover:text-primary"
                  >
                    {contract.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={milestone.paymentStatus} />
                </TableCell>
                <TableCell className="font-semibold tabular-nums">
                  {formatSar(milestone.amount)}
                </TableCell>
                <TableCell className="text-end">
                  <PaymentAction
                    contract={contract}
                    milestone={milestone}
                    currentUser={currentUser}
                  />
                </TableCell>
              </motion.tr>
            ))}
            {!filteredRows.length ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground h-32 text-center"
                >
                  لا توجد دفعات.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PaymentAction({
  contract,
  milestone,
  currentUser,
}: {
  contract: ContractListItem;
  milestone: Milestone;
  currentUser: DemoUser;
}) {
  const party = getCurrentUserParty(contract, currentUser);
  const payer = getParty(contract, "PAYER");
  const canFund =
    milestone.paymentStatus === "UNFUNDED" &&
    party?.id === payer?.id &&
    (contract.status === "ACCEPTED" || contract.status === "IN_PROGRESS");
  const href = canFund
    ? `/dashboard/contracts/${contract.id}/milestones/${milestone.id}/fund`
    : `/dashboard/contracts/${contract.id}`;

  return (
    <Button size="sm" variant="ghost" asChild>
      <Link href={href}>
        {canFund ? "تمويل" : "فتح"}
        <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-end" />
      </Link>
    </Button>
  );
}
