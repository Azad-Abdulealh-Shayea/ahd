"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileAttachmentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

export function SubmitCompletionForm({
  contractId,
  milestoneId,
}: {
  contractId: string;
  milestoneId: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const submitCompletion = api.contracts.submitCompletionRequest.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال التسليم للمراجعة.");
      router.push(`/dashboard/contracts/${contractId}`);
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const canSubmit = message.trim().length > 0 && !submitCompletion.isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    submitCompletion.mutate({
      contractId,
      milestoneId,
      message,
      deliverableUrl,
      fileName,
    });
  }

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="submission-message">رسالة التسليم</FieldLabel>
          <Textarea
            id="submission-message"
            name="message"
            placeholder="اشرح ما أنجزته وأي ملاحظات مهمة للمراجع…"
            className="min-h-32"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={submitCompletion.isPending}
          />
          <FieldDescription>
            اجعل الرسالة مرتبطة بالتسليمات ومعايير القبول.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="deliverable-url">رابط التسليم</FieldLabel>
          <Input
            id="deliverable-url"
            name="deliverableUrl"
            placeholder="https://example.com/files/deliverable.zip…"
            dir="ltr"
            value={deliverableUrl}
            onChange={(event) => setDeliverableUrl(event.target.value)}
            disabled={submitCompletion.isPending}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="file-name">اسم الملف</FieldLabel>
          <Input
            id="file-name"
            name="fileName"
            placeholder="deliverable.zip…"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            disabled={submitCompletion.isPending}
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        variant="action"
        className="w-fit"
        disabled={!canSubmit}
      >
        {submitCompletion.isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <HugeiconsIcon icon={FileAttachmentIcon} data-icon="inline-start" />
        )}
        {submitCompletion.isPending ? "جاري الإرسال…" : "إرسال طلب الإنجاز"}
      </Button>
    </form>
  );
}
