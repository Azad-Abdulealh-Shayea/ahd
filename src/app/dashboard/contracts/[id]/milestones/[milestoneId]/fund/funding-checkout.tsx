"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  CreditCardAcceptIcon,
  CreditCardAddIcon,
  CreditCardValidationIcon,
  Payment02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import {
  AnimatePresence,
  fadeUp,
  heightReveal,
  motion,
  pageStagger,
  softScale,
} from "@/components/app/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { formatSar } from "@/features/contracts/display";
import { api } from "@/trpc/react";

type CheckoutState = "idle" | "complete";
type PaymentMethod = "saved" | "manual";

export function FundingCheckout({
  contractId,
  contractTitle,
  milestoneId,
  milestoneTitle,
  amount,
  providerName,
  payerName,
}: {
  contractId: string;
  contractTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  amount: number;
  providerName: string;
  payerName: string;
}) {
  const [state, setState] = useState<CheckoutState>("idle");
  const [method, setMethod] = useState<PaymentMethod>("saved");
  const fundMilestone = api.contracts.fundMilestone.useMutation({
    onSuccess: () => {
      setState("complete");
      toast.success("تم تمويل المرحلة.");
    },
    onError: (error) => toast.error(error.message),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fundMilestone.mutate({ contractId, milestoneId });
  }

  if (state === "complete") {
    return (
      <motion.section
        initial="hidden"
        animate="visible"
        variants={pageStagger}
        className="grid gap-10 lg:grid-cols-[1fr_20rem]"
      >
        <motion.div variants={softScale} className="flex max-w-3xl flex-col gap-5">
          <div className="text-success flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} />
            <span className="font-semibold">تم التمويل</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-normal">
            {formatSar(amount)}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/dashboard/contracts/${contractId}`}>
                العودة للعقد
                <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/payments">المدفوعات</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div variants={fadeUp}>
          <CheckoutSummary
            contractTitle={contractTitle}
            milestoneTitle={milestoneTitle}
            amount={amount}
            providerName={providerName}
            payerName={payerName}
          />
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageStagger}
      className="grid gap-10 lg:grid-cols-[1fr_20rem]"
    >
      <motion.form
        variants={fadeUp}
        className="flex max-w-3xl flex-col gap-8"
        onSubmit={handleSubmit}
      >
        <FieldGroup>
          <Field>
            <FieldLabel>طريقة الدفع</FieldLabel>
            <div className="flex flex-col gap-3">
              <PaymentMethodButton
                active={method === "saved"}
                icon={CreditCardAcceptIcon}
                label="بطاقة محفوظة"
                detail="•••• 4242 · تنتهي 12/29"
                badge="محاكاة"
                onClick={() => setMethod("saved")}
              />
              <PaymentMethodButton
                active={method === "manual"}
                icon={CreditCardAddIcon}
                label="استخدام بطاقة أخرى"
                detail="إدخال اختياري لعرض تجربة الدفع فقط"
                onClick={() => setMethod("manual")}
              />
            </div>
          </Field>

          <AnimatePresence initial={false}>
            {method === "manual" ? (
              <motion.div
                key="manual-card"
                {...heightReveal}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-6 pt-1">
                  <Field>
                    <FieldLabel htmlFor="card-name">
                      الاسم على البطاقة
                    </FieldLabel>
                    <Input
                      id="card-name"
                      name="cardName"
                      autoComplete="cc-name"
                      placeholder="Ahmed Ali…"
                      disabled={fundMilestone.isPending}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="card-number">رقم البطاقة</FieldLabel>
                    <Input
                      id="card-number"
                      name="cardNumber"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242…"
                      disabled={fundMilestone.isPending}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="card-expiry">
                        تاريخ الانتهاء
                      </FieldLabel>
                      <Input
                        id="card-expiry"
                        name="cardExpiry"
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        placeholder="12/29…"
                        disabled={fundMilestone.isPending}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="card-cvc">رمز التحقق</FieldLabel>
                      <Input
                        id="card-cvc"
                        name="cardCvc"
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        placeholder="123…"
                        disabled={fundMilestone.isPending}
                      />
                    </Field>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="saved-card"
                {...heightReveal}
                className="overflow-hidden"
              >
                <Field>
                  <div className="text-muted-foreground flex items-start gap-2 text-sm leading-7">
                    <HugeiconsIcon
                      icon={CreditCardValidationIcon}
                      data-icon="inline-start"
                    />
                    سيتم تمويل المرحلة باستخدام البطاقة المحفوظة في بيئة العرض.
                  </div>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </FieldGroup>

        <Button
          type="submit"
          variant="action"
          disabled={fundMilestone.isPending}
        >
          {fundMilestone.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <HugeiconsIcon icon={Payment02Icon} data-icon="inline-start" />
          )}
          {fundMilestone.isPending ? "جاري التمويل…" : "تمويل المرحلة"}
        </Button>
      </motion.form>

      <motion.div variants={fadeUp}>
        <CheckoutSummary
          contractTitle={contractTitle}
          milestoneTitle={milestoneTitle}
          amount={amount}
          providerName={providerName}
          payerName={payerName}
        />
      </motion.div>
    </motion.section>
  );
}

function PaymentMethodButton({
  active,
  icon,
  label,
  detail,
  badge,
  onClick,
}: {
  active: boolean;
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  label: string;
  detail: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="focus-visible:ring-ring hover:bg-muted/50 aria-pressed:border-primary aria-pressed:bg-accent flex min-h-20 items-center gap-3 rounded-2xl border p-4 text-start transition-[border-color,background-color] outline-none focus-visible:ring-2"
      onClick={onClick}
    >
      <span className="bg-background flex size-9 shrink-0 items-center justify-center rounded-full border">
        <HugeiconsIcon icon={icon} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{label}</span>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </span>
        <span className="text-muted-foreground text-sm">{detail}</span>
      </span>
    </motion.button>
  );
}

function CheckoutSummary({
  contractTitle,
  milestoneTitle,
  amount,
  providerName,
  payerName,
}: {
  contractTitle: string;
  milestoneTitle: string;
  amount: number;
  providerName: string;
  payerName: string;
}) {
  return (
    <aside className="flex flex-col gap-5 lg:border-s lg:ps-6">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-sm">ملخص التمويل</span>
        <h2 className="text-xl font-semibold">{contractTitle}</h2>
      </div>
      <SummaryLine label="المرحلة" value={milestoneTitle} />
      <SummaryLine label="مقدم الخدمة" value={providerName} />
      <SummaryLine label="الممول" value={payerName} />
      <SummaryLine label="المبلغ" value={formatSar(amount)} strong />
    </aside>
  );
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          strong ? "text-lg font-semibold tabular-nums" : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
