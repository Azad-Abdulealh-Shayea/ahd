"use client";

import { useRouter } from "next/navigation";
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/trpc/react";

export function DisputeActions({
  contractId,
  milestoneId,
}: {
  contractId: string;
  milestoneId: string;
}) {
  const router = useRouter();

  const returnToContract = (message: string) => {
    toast.success(message);
    router.push(`/dashboard/contracts/${contractId}`);
    router.refresh();
  };

  const resolveDispute = api.contracts.resolveDispute.useMutation({
    onSuccess: () => returnToContract("تم حل النزاع وإرجاع المرحلة للمراجعة."),
    onError: (error) => toast.error(error.message),
  });
  const cancelDispute = api.contracts.cancelDispute.useMutation({
    onSuccess: () => returnToContract("تم إلغاء النزاع وإرجاع المرحلة للمراجعة."),
    onError: (error) => toast.error(error.message),
  });
  const isPending = resolveDispute.isPending || cancelDispute.isPending;

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="action"
        disabled={isPending}
        onClick={() => resolveDispute.mutate({ contractId, milestoneId })}
      >
        {resolveDispute.isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
        )}
        حل النزاع
      </Button>
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() => cancelDispute.mutate({ contractId, milestoneId })}
      >
        {cancelDispute.isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <HugeiconsIcon icon={CancelCircleIcon} data-icon="inline-start" />
        )}
        إلغاء النزاع
      </Button>
    </div>
  );
}
