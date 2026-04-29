"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft02Icon,
  CopyLinkIcon,
  MoreHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { motion } from "@/components/app/motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContractStatusBadge,
  formatSar,
  PaymentStatusBadge,
} from "@/features/contracts/display";
import {
  getNextAction,
  getOtherParty,
  getPrimaryMilestone,
  type ContractListItem,
} from "@/features/contracts/view-models";
import type { DemoUser } from "../../../../generated/prisma";

export function ContractsTable({
  data,
  currentUser,
}: {
  data: ContractListItem[];
  currentUser: DemoUser;
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(
    () =>
      data.filter((contract) => {
        const otherParty = getOtherParty(contract, currentUser);

        return [contract.id, contract.title, otherParty?.name]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      }),
    [data, currentUser, search],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full max-w-sm">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <HugeiconsIcon icon={Search01Icon} />
        </div>
        <Input
          type="search"
          placeholder="ابحث باسم العقد أو الطرف الآخر…"
          className="ps-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="overflow-hidden border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العقد</TableHead>
              <TableHead>الطرف الآخر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الدفع</TableHead>
              <TableHead>المرحلة</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead className="text-end">الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((contract, index) => (
              <ContractRow
                key={contract.id}
                contract={contract}
                currentUser={currentUser}
                index={index}
              />
            ))}
            {!filteredData.length ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-32 text-center"
                >
                  لا توجد عقود.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ContractRow({
  contract,
  currentUser,
  index,
}: {
  contract: ContractListItem;
  currentUser: DemoUser;
  index: number;
}) {
  const milestone = getPrimaryMilestone(contract);
  const otherParty = getOtherParty(contract, currentUser);
  const action = getNextAction(contract, currentUser);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.18) }}
      className="hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
    >
      <TableCell>
        <Link
          href={`/dashboard/contracts/${contract.id}`}
          className="hover:text-primary font-medium"
        >
          {contract.title}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {otherParty?.name ?? "-"}
      </TableCell>
      <TableCell>
        <ContractStatusBadge status={contract.status} />
      </TableCell>
      <TableCell>
        {milestone ? (
          <PaymentStatusBadge status={milestone.paymentStatus} />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {milestone?.title ?? "-"}
      </TableCell>
      <TableCell className="font-semibold">
        {formatSar(contract.totalAmount)}
      </TableCell>
      <TableCell className="text-end">
        <ContractRowActions contract={contract} action={action} />
      </TableCell>
    </motion.tr>
  );
}

function ContractRowActions({
  contract,
  action,
}: {
  contract: ContractListItem;
  action: ReturnType<typeof getNextAction>;
}) {
  const canCopyInvite = contract.status === "SENT" && !!contract.inviteToken;

  async function copyInviteLink() {
    if (!contract.inviteToken) return;

    try {
      const inviteLink = `${window.location.origin}/contracts/invite/${contract.inviteToken}`;

      await navigator.clipboard.writeText(inviteLink);
      toast.success("تم نسخ رابط الدعوة");
    } catch {
      toast.error("تعذر نسخ رابط الدعوة");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="إجراءات العقد">
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={action.href} className="gap-2">
              <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-start" />
              {action.label}
            </Link>
          </DropdownMenuItem>
          {canCopyInvite ? (
            <DropdownMenuItem className="gap-2" onSelect={copyInviteLink}>
              <HugeiconsIcon icon={CopyLinkIcon} data-icon="inline-start" />
              نسخ رابط الدعوة
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
