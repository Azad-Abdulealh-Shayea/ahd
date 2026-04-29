"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  MessageEdit01Icon,
  Refresh03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

type Criterion = {
  id: string;
  text: string;
};

export function ReviewWorkflowActions({
  contractId,
  milestoneId,
  criteria,
  revisionsExhausted,
}: {
  contractId: string;
  milestoneId: string;
  criteria: Criterion[];
  revisionsExhausted: boolean;
}) {
  const router = useRouter();
  const firstCriterionId = criteria[0]?.id ?? "";
  const [criterionId, setCriterionId] = useState(firstCriterionId);
  const [feedback, setFeedback] = useState("");
  const [changeTitle, setChangeTitle] = useState("");
  const [changeAmount, setChangeAmount] = useState("");

  const returnToContract = (message: string) => {
    toast.success(message);
    router.push(`/dashboard/contracts/${contractId}`);
    router.refresh();
  };

  const approve = api.contracts.approveMilestone.useMutation({
    onSuccess: () => returnToContract("تم اعتماد المرحلة وصرف الدفعة."),
    onError: (error) => toast.error(error.message),
  });
  const requestRevision = api.contracts.requestRevision.useMutation({
    onSuccess: () => returnToContract("تم إرسال طلب التعديل."),
    onError: (error) => toast.error(error.message),
  });
  const requestChangeOrder = api.contracts.requestChangeOrder.useMutation({
    onSuccess: () => returnToContract("تم تسجيل طلب التغيير المدفوع."),
    onError: (error) => toast.error(error.message),
  });
  const openDispute = api.contracts.openDispute.useMutation({
    onSuccess: () => returnToContract("تم فتح النزاع وإيقاف الصرف."),
    onError: (error) => toast.error(error.message),
  });
  const simulateAutoApprove = api.contracts.simulateAutoApprove.useMutation({
    onSuccess: () => returnToContract("تمت محاكاة انتهاء نافذة المراجعة."),
    onError: (error) => toast.error(error.message),
  });

  const isPending =
    approve.isPending ||
    requestRevision.isPending ||
    requestChangeOrder.isPending ||
    openDispute.isPending ||
    simulateAutoApprove.isPending;

  const canUseCriterion = criterionId.length > 0;
  const canSendFeedback = canUseCriterion && feedback.trim().length > 0;
  const canRequestChange =
    changeTitle.trim().length > 0 &&
    feedback.trim().length > 0 &&
    Number.parseInt(changeAmount, 10) > 0;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">قرار المراجعة</h2>
        <Button
          variant="action"
          onClick={() => approve.mutate({ contractId, milestoneId })}
          disabled={isPending}
        >
          {approve.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              data-icon="inline-start"
            />
          )}
          اعتماد وصرف الدفعة
        </Button>
      </div>

      <Tabs defaultValue={revisionsExhausted ? "change" : "revision"}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="revision" disabled={revisionsExhausted}>
            تعديل
          </TabsTrigger>
          <TabsTrigger value="change">تغيير مدفوع</TabsTrigger>
          <TabsTrigger value="dispute">نزاع</TabsTrigger>
        </TabsList>

        <TabsContent value="revision" className="pt-4">
          <FieldGroup>
            <CriterionField
              criteria={criteria}
              criterionId={criterionId}
              setCriterionId={setCriterionId}
              disabled={isPending}
            />
            <Field>
              <FieldLabel htmlFor="revision-feedback">
                ملاحظات التعديل
              </FieldLabel>
              <Textarea
                id="revision-feedback"
                placeholder="اكتب التعديل المطلوب وربطه بمعيار القبول…"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                disabled={isPending}
              />
            </Field>
            <Button
              variant="outline"
              disabled={isPending || revisionsExhausted || !canSendFeedback}
              onClick={() =>
                requestRevision.mutate({
                  contractId,
                  milestoneId,
                  acceptanceCriterionId: criterionId,
                  feedback,
                })
              }
            >
              {requestRevision.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon
                  icon={MessageEdit01Icon}
                  data-icon="inline-start"
                />
              )}
              طلب تعديل
            </Button>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="change" className="pt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="change-title">عنوان التغيير</FieldLabel>
              <Input
                id="change-title"
                placeholder="مثلاً: إضافة صفحة هبوط جديدة…"
                value={changeTitle}
                onChange={(event) => setChangeTitle(event.target.value)}
                disabled={isPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="change-description">
                وصف التغيير
              </FieldLabel>
              <Textarea
                id="change-description"
                placeholder="اشرح العمل الإضافي المطلوب ولماذا هو خارج نطاق المرحلة…"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                disabled={isPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="change-order-amount">
                مبلغ طلب التغيير
              </FieldLabel>
              <Input
                id="change-order-amount"
                placeholder="750…"
                inputMode="numeric"
                value={changeAmount}
                onChange={(event) => setChangeAmount(event.target.value)}
                disabled={isPending}
              />
            </Field>
            <Button
              variant="secondary"
              disabled={isPending || !canRequestChange}
              onClick={() =>
                requestChangeOrder.mutate({
                  contractId,
                  milestoneId,
                  title: changeTitle,
                  description: feedback,
                  amount: Number.parseInt(changeAmount, 10),
                })
              }
            >
              {requestChangeOrder.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon icon={Refresh03Icon} data-icon="inline-start" />
              )}
              طلب تغيير مدفوع
            </Button>
          </FieldGroup>
        </TabsContent>

        <TabsContent value="dispute" className="pt-4">
          <FieldGroup>
            <CriterionField
              criteria={criteria}
              criterionId={criterionId}
              setCriterionId={setCriterionId}
              disabled={isPending}
            />
            <Field>
              <FieldLabel htmlFor="dispute-reason">سبب النزاع</FieldLabel>
              <Textarea
                id="dispute-reason"
                placeholder="اكتب سبب النزاع بناءً على معيار القبول المحدد…"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                disabled={isPending}
              />
            </Field>
            <Button
              variant="destructive"
              disabled={isPending || !canSendFeedback}
              onClick={() =>
                openDispute.mutate({
                  contractId,
                  milestoneId,
                  acceptanceCriterionId: criterionId,
                  reason: feedback,
                })
              }
            >
              {openDispute.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  data-icon="inline-start"
                />
              )}
              فتح نزاع
            </Button>
          </FieldGroup>
        </TabsContent>
      </Tabs>

      <Button
        variant="ghost"
        disabled={isPending}
        onClick={() => simulateAutoApprove.mutate({ contractId, milestoneId })}
      >
        {simulateAutoApprove.isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <HugeiconsIcon icon={Clock01Icon} data-icon="inline-start" />
        )}
        محاكاة انتهاء نافذة المراجعة
      </Button>
    </section>
  );
}

function CriterionField({
  criteria,
  criterionId,
  setCriterionId,
  disabled,
}: {
  criteria: Criterion[];
  criterionId: string;
  setCriterionId: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="acceptance-criterion">المعيار المرتبط</FieldLabel>
      <NativeSelect
        id="acceptance-criterion"
        className="w-full"
        value={criterionId}
        onChange={(event) => setCriterionId(event.target.value)}
        disabled={disabled}
      >
        {criteria.map((criterion) => (
          <NativeSelectOption key={criterion.id} value={criterion.id}>
            {criterion.text}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}
