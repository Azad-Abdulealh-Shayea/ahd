"use client";

import { useEffect, useState } from "react";
import {
  AlertCircleIcon,
  Briefcase04Icon,
  Calendar02Icon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  FileAttachmentIcon,
  MoneySecurityIcon,
  PlusSignIcon,
  Refresh03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useController,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { HelpBadge, HelpTooltip } from "@/components/app/help";
import { fadeUp, motion } from "@/components/app/motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useCreateContractFlow,
  useFieldUpdateGlow,
} from "@/features/contracts/components/create-contract-provider";
import { formatSar } from "@/features/contracts/display";
import type { CreateAndSendContractFormInput } from "@/features/contracts/schemas";
import { cn } from "@/lib/utils";

const maxMilestones = 6;

type MilestoneDraft = CreateAndSendContractFormInput["milestones"][number];

export function CreateContractSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-5 border-b pb-8 last:border-b-0 last:pb-0"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}

export function RoleFields() {
  const { control } = useFormContext<CreateAndSendContractFormInput>();
  const { field } = useController({
    control,
    name: "creatorRole",
  });

  return (
    <FieldSet>
      <div className="flex items-center gap-2">
        <FieldLegend>دورك في هذا العقد</FieldLegend>
        <HelpBadge title="لماذا نحدد الدور؟">
          الدور يحدد من يمول المراحل، من يراجع التسليم، ومن يستلم الدفعة بعد
          الاعتماد.
        </HelpBadge>
      </div>
      <ToggleGroup
        type="single"
        variant="outline"
        spacing={2}
        value={field.value}
        onValueChange={(value) => value && field.onChange(value)}
        className="grid w-full gap-3 md:grid-cols-2"
      >
        <ToggleGroupItem
          value="PROVIDER"
          className="h-auto min-h-24 justify-start rounded-2xl px-4 py-4 text-start"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Briefcase04Icon} />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-medium">أقدم العمل</span>
              <span className="text-muted-foreground text-sm font-normal">
                أرسل التسليمات وأستلم الدفعات عند اعتمادها.
              </span>
            </span>
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="PAYER_REVIEWER"
          className="h-auto min-h-24 justify-start rounded-2xl px-4 py-4 text-start"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-warning text-warning-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
              <HugeiconsIcon icon={MoneySecurityIcon} />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-medium">أمول وأراجع</span>
              <span className="text-muted-foreground text-sm font-normal">
                أمول المراحل وأقرر الاعتماد أو طلب تعديل واضح.
              </span>
            </span>
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
    </FieldSet>
  );
}

export function ContractBasicsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAndSendContractFormInput>();
  const titleUpdated = useFieldUpdateGlow("title");
  const amountUpdated = useFieldUpdateGlow("totalAmount");
  const descriptionUpdated = useFieldUpdateGlow("description");

  return (
    <FieldGroup>
      <div className="grid gap-5 md:grid-cols-[1fr_14rem]">
        <Field
          data-invalid={!!errors.title}
          data-update-glow={titleUpdated || undefined}
        >
          <FieldLabel htmlFor="contract-title">عنوان العقد</FieldLabel>
          <Input
            id="contract-title"
            placeholder="مثال: تصميم الهوية البصرية لمتجر لُما…"
            autoComplete="off"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          <FieldError>{errors.title?.message}</FieldError>
        </Field>
        <Field
          data-invalid={!!errors.totalAmount}
          data-update-glow={amountUpdated || undefined}
        >
          <FieldLabel htmlFor="contract-total-amount" className="items-center">
            إجمالي العقد
            <HelpBadge>
              هذا سقف التمويل. يمكن ترك جزء غير موزع للمراحل.
            </HelpBadge>
          </FieldLabel>
          <Input
            id="contract-total-amount"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="18000…"
            aria-invalid={!!errors.totalAmount}
            {...register("totalAmount", { valueAsNumber: true })}
          />
          <FieldError>{errors.totalAmount?.message}</FieldError>
        </Field>
      </div>
      <Field
        data-invalid={!!errors.description}
        data-update-glow={descriptionUpdated || undefined}
      >
        <FieldLabel htmlFor="contract-description">وصف مختصر</FieldLabel>
        <Textarea
          id="contract-description"
          placeholder="اكتب نطاق العمل والنتيجة المتوقعة…"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </Field>
    </FieldGroup>
  );
}

export function OtherPartyFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAndSendContractFormInput>();
  const { fixedOtherParty } = useCreateContractFlow();
  const otherPartyErrors = errors.otherParty;
  const nameUpdated = useFieldUpdateGlow("otherParty.name");
  const emailUpdated = useFieldUpdateGlow("otherParty.email");
  const phoneUpdated = useFieldUpdateGlow("otherParty.phone");

  return (
    <FieldGroup>
      <Alert className="border-primary/20 bg-primary/5">
        <HugeiconsIcon icon={AlertCircleIcon} />
        <AlertTitle>ثابت لأغراض العرض</AlertTitle>
        <AlertDescription>
          في هذا النموذج التجريبي، الطرف الآخر محدد تلقائياً باسم{" "}
          {fixedOtherParty.name} ولا يمكن تغييره.
        </AlertDescription>
      </Alert>
      <Field
        data-invalid={!!otherPartyErrors?.name}
        data-update-glow={nameUpdated || undefined}
      >
        <FieldLabel htmlFor="other-party-name">اسم الطرف الآخر</FieldLabel>
        <Input
          id="other-party-name"
          placeholder="مثال: أحمد خالد…"
          autoComplete="name"
          readOnly
          aria-invalid={!!otherPartyErrors?.name}
          {...register("otherParty.name")}
        />
        <FieldError>{otherPartyErrors?.name?.message}</FieldError>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          data-invalid={!!otherPartyErrors?.email}
          data-update-glow={emailUpdated || undefined}
        >
          <FieldLabel htmlFor="other-party-email">البريد الإلكتروني</FieldLabel>
          <Input
            id="other-party-email"
            type="email"
            inputMode="email"
            placeholder="name@example.com…"
            autoComplete="email"
            spellCheck={false}
            readOnly
            aria-invalid={!!otherPartyErrors?.email}
            {...register("otherParty.email")}
          />
          <FieldError>{otherPartyErrors?.email?.message}</FieldError>
        </Field>
        <Field
          data-invalid={!!otherPartyErrors?.phone}
          data-update-glow={phoneUpdated || undefined}
        >
          <FieldLabel htmlFor="other-party-phone">رقم الجوال</FieldLabel>
          <Input
            id="other-party-phone"
            type="tel"
            inputMode="tel"
            placeholder="+9665…"
            autoComplete="tel"
            readOnly
            aria-invalid={!!otherPartyErrors?.phone}
            {...register("otherParty.phone")}
          />
          <FieldError>{otherPartyErrors?.phone?.message}</FieldError>
        </Field>
      </div>
    </FieldGroup>
  );
}

export function MilestoneBuilder() {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<CreateAndSendContractFormInput>();
  const { glowUpdatedFields } = useCreateContractFlow();
  const { fields, insert, remove } = useFieldArray({
    control,
    name: "milestones",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const milestones = useWatch({ control, name: "milestones" }) ?? [];
  const totalAmount = numberOrZero(useWatch({ control, name: "totalAmount" }));
  const activeMilestone = milestones[activeIndex] ?? milestones[0];
  const allocation = getAllocation(totalAmount, milestones);
  const milestoneMessage = getMilestoneMessage(errors.milestones);

  useEffect(() => {
    if (activeIndex <= milestones.length - 1) return;
    setActiveIndex(Math.max(0, milestones.length - 1));
  }, [activeIndex, milestones.length]);

  function insertMilestone(index: number) {
    if (fields.length >= maxMilestones) return;

    insert(index, createBlankMilestone(), { shouldFocus: false });
    setActiveIndex(index);
  }

  function deleteMilestone(index: number) {
    if (fields.length <= 1) return;

    const nextIndex =
      index === activeIndex
        ? Math.max(0, index - 1)
        : index < activeIndex
          ? activeIndex - 1
          : activeIndex;

    remove(index);
    setActiveIndex(nextIndex);
  }

  function distributeEqually() {
    const total = numberOrZero(getValues("totalAmount"));
    if (!total || !milestones.length) return;
    const baseAmount = Math.floor(total / milestones.length);
    let allocated = 0;
    const amounts = milestones.map((_, index) => {
      if (index === milestones.length - 1) return total - allocated;

      const amount = baseAmount;
      allocated += amount;

      return amount;
    });

    setValue(
      "milestones",
      milestones.map((milestone, index) => ({
        ...milestone,
        amount: amounts[index] ?? 0,
      })),
      { shouldDirty: true, shouldValidate: true },
    );
    glowUpdatedFields(milestones.map((_, index) => `milestones.${index}.amount`));
  }

  if (!activeMilestone) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <AllocationSummary
        totalAmount={totalAmount}
        allocation={allocation}
        milestones={milestones}
        onEqualDistribution={distributeEqually}
      />

      {milestoneMessage ? (
        <Alert variant={allocation.isOverAllocated ? "destructive" : "default"}>
          <HugeiconsIcon icon={AlertCircleIcon} />
          <AlertTitle>تحقق من توزيع المبلغ</AlertTitle>
          <AlertDescription>{milestoneMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
        <MilestoneTimeline
          fields={fields}
          milestones={milestones}
          activeIndex={activeIndex}
          canAdd={fields.length < maxMilestones}
          canRemove={fields.length > 1}
          onSelect={setActiveIndex}
          onInsert={insertMilestone}
          onDelete={deleteMilestone}
        />
        <MilestoneActiveForm index={activeIndex} totalAmount={totalAmount} />
      </div>
    </div>
  );
}

export function ContractReviewSummary() {
  const values = useWatch<CreateAndSendContractFormInput>();
  const milestones = values.milestones ?? [];
  const totalAmount = numberOrZero(values.totalAmount);
  const allocation = getAllocation(totalAmount, milestones);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryStat label="الدور" value={roleLabel(values.creatorRole)} />
        <SummaryStat
          label="الطرف الآخر"
          value={textOr(values.otherParty?.name, "-")}
        />
        <SummaryStat label="إجمالي العقد" value={formatSar(totalAmount)} />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">
            {textOr(values.title, "عقد بدون عنوان")}
          </h3>
          <p className="text-muted-foreground text-sm leading-7">
            {textOr(values.description, "لم يتم إدخال وصف بعد.")}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <SummaryLine label="مقدم العمل" value={providerLabel(values)} />
          <SummaryLine label="الممول والمراجع" value={payerLabel(values)} />
          <SummaryLine
            label="المبلغ الموزع"
            value={formatSar(allocation.allocatedAmount)}
          />
          <SummaryLine
            label={allocation.isOverAllocated ? "تجاوز" : "المتبقي غير موزع"}
            value={formatSar(
              allocation.isOverAllocated
                ? allocation.overAmount
                : allocation.remainingAmount,
            )}
          />
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">خط المراحل</h3>
          <Badge variant="outline">{milestones.length} مرحلة</Badge>
        </div>
        <div className="flex flex-col gap-3">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="grid gap-3 border-b py-4 md:grid-cols-[auto_1fr_auto]"
            >
              <div
                className={cn(
                  "text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-semibold",
                  milestoneColor(index),
                )}
              >
                {index + 1}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {textOr(milestone?.title, `المرحلة ${index + 1}`)}
                  </span>
                  <Badge variant="secondary">
                    {formatSar(numberOrZero(milestone?.amount))}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
                  {textOr(milestone?.description, "لا يوجد وصف لهذه المرحلة.")}
                </p>
                <div className="flex flex-col gap-1">
                  {(milestone?.acceptanceCriteria ?? [])
                    .filter((criterion) => criterion.trim())
                    .slice(0, 3)
                    .map((criterion, criterionIndex) => (
                      <span
                        key={criterionIndex}
                        className="text-muted-foreground text-xs leading-5"
                      >
                        {criterionIndex + 1}. {criterion}
                      </span>
                    ))}
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={FileAttachmentIcon} />
                    {milestone?.deliverables?.length ?? 0} تسليم
                  </span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={CheckListIcon} />
                    {milestone?.acceptanceCriteria?.length ?? 0} معيار قبول
                  </span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Refresh03Icon} />
                    {numberOrZero(milestone?.revisionsAllowed)} تعديلات
                  </span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar02Icon} />
                    {numberOrZero(milestone?.reviewWindowHours)} ساعة مراجعة
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm md:text-end">
                <span className="text-muted-foreground">معايير القبول</span>
                <span className="font-medium">
                  {milestone?.acceptanceCriteria?.filter(Boolean).length ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Alert>
        <HugeiconsIcon icon={CheckmarkCircle02Icon} />
        <AlertTitle>بعد الإرسال</AlertTitle>
        <AlertDescription>
          سيصل العقد للطرف الآخر كدعوة. بعد القبول يبدأ تمويل المراحل، ولا تصرف
          أي دفعة إلا بعد التمويل والاعتماد وعدم وجود نزاع مفتوح.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function CreateContractSummary() {
  const values = useWatch<CreateAndSendContractFormInput>();
  const totalAmount = numberOrZero(values.totalAmount);
  const milestones = values.milestones ?? [];
  const allocation = getAllocation(totalAmount, milestones);

  return (
    <aside className="bg-background/70 sticky top-20 hidden rounded-2xl border p-4 backdrop-blur lg:flex lg:flex-col lg:gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs">إجمالي العقد</span>
        <span className="text-2xl font-semibold">{formatSar(totalAmount)}</span>
      </div>
      <Separator />
      <SummaryLine label="الدور" value={roleLabel(values.creatorRole)} />
      <SummaryLine
        label="الطرف الآخر"
        value={textOr(values.otherParty?.name, "-")}
      />
      <SummaryLine
        label="المراحل"
        value={`${milestones.length}/${maxMilestones}`}
      />
      <SummaryLine
        label="الموزع"
        value={formatSar(allocation.allocatedAmount)}
      />
      <SummaryLine
        label={allocation.isOverAllocated ? "تجاوز" : "المتبقي"}
        value={formatSar(
          allocation.isOverAllocated
            ? allocation.overAmount
            : allocation.remainingAmount,
        )}
      />
    </aside>
  );
}

export function SubmitCreateContractButton({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <Button type="submit" variant="action" disabled={isSubmitting} size="lg">
      {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
      إنشاء وإرسال العقد
    </Button>
  );
}

function MilestoneTimeline({
  fields,
  milestones,
  activeIndex,
  canAdd,
  canRemove,
  onSelect,
  onInsert,
  onDelete,
}: {
  fields: Array<{ id: string }>;
  milestones: MilestoneDraft[];
  activeIndex: number;
  canAdd: boolean;
  canRemove: boolean;
  onSelect: (index: number) => void;
  onInsert: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <aside className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">المراحل</span>
        <Badge variant="outline">
          {milestones.length}/{maxMilestones}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => {
          const milestone = milestones[index] ?? createBlankMilestone();
          const isActive = activeIndex === index;
          const isComplete =
            textOr(milestone.title, "") &&
            numberOrZero(milestone.amount) > 0 &&
            textOr(milestone.description, "");

          return (
            <div key={field.id} className="flex flex-col gap-2">
              <div
                className={cn(
                  "group grid grid-cols-[1fr_auto] items-center gap-2 border-b py-2",
                  isActive && "border-primary",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className="focus-visible:ring-ring grid min-h-14 min-w-0 grid-cols-[auto_1fr] items-center gap-3 rounded-xl text-start outline-none focus-visible:ring-3"
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                      isActive && "bg-primary text-primary-foreground",
                      !isActive && "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          isComplete ? "bg-success" : "bg-warning",
                        )}
                        aria-label={isComplete ? "جاهزة" : "غير مكتملة"}
                      />
                      <span className="truncate font-medium">
                        {textOr(milestone.title, `مرحلة ${index + 1}`)}
                      </span>
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {formatSar(numberOrZero(milestone.amount))}
                    </span>
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-60 group-focus-within:opacity-100 group-hover:opacity-100"
                  onClick={() => onDelete(index)}
                  disabled={!canRemove}
                  aria-label={`حذف المرحلة ${index + 1}`}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </Button>
              </div>
              {index < fields.length - 1 ? (
                <InsertMilestoneButton
                  disabled={!canAdd}
                  onClick={() => onInsert(index + 1)}
                  label={`إدراج مرحلة بعد المرحلة ${index + 1}`}
                />
              ) : null}
            </div>
          );
        })}
        <InsertMilestoneButton
          disabled={!canAdd}
          onClick={() => onInsert(milestones.length)}
          label="إضافة مرحلة في نهاية العقد"
        />
      </div>
    </aside>
  );
}

function InsertMilestoneButton({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4">
      <Separator className="flex-1" />
      <HelpTooltip
        title="إضافة مرحلة"
        content="استخدمها لتقسيم العمل إلى نقطة تمويل ومراجعة مستقلة. لا تضف مرحلة إلا إذا كانت لها نتيجة واضحة."
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className="rounded-full"
        >
          <HugeiconsIcon icon={PlusSignIcon} />
        </Button>
      </HelpTooltip>
      <Separator className="flex-1" />
    </div>
  );
}

function MilestoneActiveForm({
  index,
  totalAmount,
}: {
  index: number;
  totalAmount: number;
}) {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<CreateAndSendContractFormInput>();
  const milestone =
    (useWatch({
      name: `milestones.${index}`,
    }) as MilestoneDraft | undefined) ?? createBlankMilestone();
  const milestoneErrors = errors.milestones?.[index];
  const amount = numberOrZero(milestone?.amount);
  const sliderMax = Math.max(totalAmount, amount, 1);
  const titleUpdated = useFieldUpdateGlow(`milestones.${index}.title`);
  const amountUpdated = useFieldUpdateGlow(`milestones.${index}.amount`);
  const descriptionUpdated = useFieldUpdateGlow(
    `milestones.${index}.description`,
  );
  const deliverablesUpdated = useFieldUpdateGlow(
    `milestones.${index}.deliverables`,
  );
  const criteriaUpdated = useFieldUpdateGlow(
    `milestones.${index}.acceptanceCriteria`,
  );
  const revisionsUpdated = useFieldUpdateGlow(
    `milestones.${index}.revisionsAllowed`,
  );
  const reviewWindowUpdated = useFieldUpdateGlow(
    `milestones.${index}.reviewWindowHours`,
  );

  function addDeliverable() {
    const current = getValues(`milestones.${index}.deliverables`);
    if (current.length >= 5) return;
    setValue(
      `milestones.${index}.deliverables`,
      [...current, { title: "", description: "" }],
      { shouldDirty: true },
    );
  }

  function removeDeliverable(itemIndex: number) {
    const current = getValues(`milestones.${index}.deliverables`);
    if (current.length <= 1) return;
    setValue(
      `milestones.${index}.deliverables`,
      current.filter((_, currentIndex) => currentIndex !== itemIndex),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function addCriterion() {
    const current = getValues(`milestones.${index}.acceptanceCriteria`);
    if (current.length >= 8) return;
    setValue(`milestones.${index}.acceptanceCriteria`, [...current, ""], {
      shouldDirty: true,
    });
  }

  function removeCriterion(itemIndex: number) {
    const current = getValues(`milestones.${index}.acceptanceCriteria`);
    if (current.length <= 1) return;
    setValue(
      `milestones.${index}.acceptanceCriteria`,
      current.filter((_, currentIndex) => currentIndex !== itemIndex),
      { shouldDirty: true, shouldValidate: true },
    );
  }

  function updateAmount(nextAmount: number) {
    setValue(`milestones.${index}.amount`, Math.max(0, nextAmount), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <FieldGroup>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-sm">
          المرحلة {index + 1}
        </span>
        <h3 className="text-xl font-semibold">
          {textOr(milestone?.title, "تفاصيل المرحلة")}
        </h3>
      </div>

      <Field
        data-invalid={!!milestoneErrors?.title}
        data-update-glow={titleUpdated || undefined}
      >
        <FieldLabel htmlFor={`milestone-${index}-title`}>
          اسم المرحلة
        </FieldLabel>
        <Input
          id={`milestone-${index}-title`}
          placeholder="مثال: نظام الهوية الأساسي…"
          autoComplete="off"
          aria-invalid={!!milestoneErrors?.title}
          {...register(`milestones.${index}.title`)}
        />
        <FieldError>{milestoneErrors?.title?.message}</FieldError>
      </Field>

      <Field
        data-invalid={!!milestoneErrors?.amount}
        data-update-glow={amountUpdated || undefined}
      >
        <div className="flex flex-col gap-3 border-y py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={`milestone-${index}-amount-slider`}>
                التخصيص المالي
              </FieldLabel>
              <span className="text-muted-foreground text-sm">
                حرّك المبلغ داخل سقف العقد أو أدخل رقماً دقيقاً بالأعلى.
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tabular-nums">
                {formatSar(amount)}
              </span>
              <span className="text-muted-foreground text-sm">SAR</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_12rem] md:items-center">
            <Slider
              id={`milestone-${index}-amount-slider`}
              value={[Math.min(amount, sliderMax)]}
              min={0}
              max={sliderMax}
              step={100}
              onValueChange={(value) => updateAmount(value[0] ?? 0)}
              aria-label="تخصيص مبلغ المرحلة"
            />
            <Input
              id={`milestone-${index}-amount`}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="9000…"
              aria-label="مبلغ المرحلة بالريال السعودي"
              aria-invalid={!!milestoneErrors?.amount}
              {...register(`milestones.${index}.amount`, {
                valueAsNumber: true,
              })}
            />
          </div>
          <FieldError>{milestoneErrors?.amount?.message}</FieldError>
        </div>
      </Field>

      <Field
        data-invalid={!!milestoneErrors?.description}
        data-update-glow={descriptionUpdated || undefined}
      >
        <FieldLabel htmlFor={`milestone-${index}-description`}>
          وصف المرحلة
        </FieldLabel>
        <Textarea
          id={`milestone-${index}-description`}
          placeholder="ما الذي سيتم تسليمه في هذه المرحلة؟…"
          aria-invalid={!!milestoneErrors?.description}
          {...register(`milestones.${index}.description`)}
        />
        <FieldError>{milestoneErrors?.description?.message}</FieldError>
      </Field>

      <FieldSet>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FieldLegend variant="label">التسليمات</FieldLegend>
            <HelpBadge title="التسليمات">
              الملفات أو الروابط أو النتائج التي سيستلمها الطرف الآخر عند مراجعة
              المرحلة.
            </HelpBadge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={addDeliverable}
            disabled={milestone.deliverables.length >= 5}
          >
            <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
            إضافة
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {milestone.deliverables.map((_, itemIndex) => (
            <div
              key={itemIndex}
              className="grid gap-3 border-b pb-4 md:grid-cols-[1fr_1.4fr_auto]"
            >
              <Field
                data-invalid={
                  !!milestoneErrors?.deliverables?.[itemIndex]?.title
                }
                data-update-glow={deliverablesUpdated || undefined}
              >
                <FieldLabel htmlFor={`deliverable-${index}-${itemIndex}-title`}>
                  اسم التسليم
                </FieldLabel>
                <Input
                  id={`deliverable-${index}-${itemIndex}-title`}
                  placeholder="ملف الشعار…"
                  aria-invalid={
                    !!milestoneErrors?.deliverables?.[itemIndex]?.title
                  }
                  {...register(
                    `milestones.${index}.deliverables.${itemIndex}.title`,
                  )}
                />
                <FieldError>
                  {milestoneErrors?.deliverables?.[itemIndex]?.title?.message}
                </FieldError>
              </Field>
              <Field
                data-invalid={
                  !!milestoneErrors?.deliverables?.[itemIndex]?.description
                }
                data-update-glow={deliverablesUpdated || undefined}
              >
                <FieldLabel
                  htmlFor={`deliverable-${index}-${itemIndex}-description`}
                >
                  الوصف
                </FieldLabel>
                <Input
                  id={`deliverable-${index}-${itemIndex}-description`}
                  placeholder="الصيغ والمحتوى المتوقع…"
                  aria-invalid={
                    !!milestoneErrors?.deliverables?.[itemIndex]?.description
                  }
                  {...register(
                    `milestones.${index}.deliverables.${itemIndex}.description`,
                  )}
                />
                <FieldError>
                  {
                    milestoneErrors?.deliverables?.[itemIndex]?.description
                      ?.message
                  }
                </FieldError>
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="self-end"
                onClick={() => removeDeliverable(itemIndex)}
                disabled={milestone.deliverables.length <= 1}
                aria-label="حذف التسليم"
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </div>
          ))}
        </div>
      </FieldSet>

      <FieldSet>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FieldLegend variant="label">معايير القبول</FieldLegend>
            <HelpBadge title="معيار القبول">
              معيار واضح يحدد متى يعتبر التسليم مقبولاً. النزاعات والتعديلات يجب
              أن ترتبط بهذه المعايير لاحقاً.
            </HelpBadge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={addCriterion}
            disabled={milestone.acceptanceCriteria.length >= 8}
          >
            <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
            إضافة
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {milestone.acceptanceCriteria.map((_, itemIndex) => (
            <Field
              key={itemIndex}
              data-invalid={!!milestoneErrors?.acceptanceCriteria?.[itemIndex]}
              data-update-glow={criteriaUpdated || undefined}
              className="grid gap-3 md:grid-cols-[1fr_auto]"
            >
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor={`criterion-${index}-${itemIndex}`}>
                  معيار {itemIndex + 1}
                </FieldLabel>
                <Input
                  id={`criterion-${index}-${itemIndex}`}
                  placeholder="مثال: الشعار واضح على خلفية فاتحة وداكنة…"
                  aria-invalid={
                    !!milestoneErrors?.acceptanceCriteria?.[itemIndex]
                  }
                  {...register(
                    `milestones.${index}.acceptanceCriteria.${itemIndex}`,
                  )}
                />
                <FieldError>
                  {milestoneErrors?.acceptanceCriteria?.[itemIndex]?.message}
                </FieldError>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="self-end"
                onClick={() => removeCriterion(itemIndex)}
                disabled={milestone.acceptanceCriteria.length <= 1}
                aria-label="حذف معيار القبول"
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </Field>
          ))}
        </div>
      </FieldSet>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          data-invalid={!!milestoneErrors?.revisionsAllowed}
          data-update-glow={revisionsUpdated || undefined}
        >
          <FieldLabel htmlFor={`milestone-${index}-revisions`}>
            عدد التعديلات
            <HelpBadge>
              عند انتهاء العدد، يصبح الخيار طلب تغيير مدفوع أو نزاع مرتبط بمعيار
              قبول.
            </HelpBadge>
          </FieldLabel>
          <Input
            id={`milestone-${index}-revisions`}
            type="number"
            inputMode="numeric"
            min={0}
            max={10}
            aria-invalid={!!milestoneErrors?.revisionsAllowed}
            {...register(`milestones.${index}.revisionsAllowed`, {
              valueAsNumber: true,
            })}
          />
          <FieldError>{milestoneErrors?.revisionsAllowed?.message}</FieldError>
        </Field>
        <Field
          data-invalid={!!milestoneErrors?.reviewWindowHours}
          data-update-glow={reviewWindowUpdated || undefined}
        >
          <FieldLabel htmlFor={`milestone-${index}-review-window`}>
            نافذة المراجعة بالساعات
            <HelpBadge>
              بعد انتهاء النافذة يمكن تطبيق الاعتماد التلقائي.
            </HelpBadge>
          </FieldLabel>
          <Input
            id={`milestone-${index}-review-window`}
            type="number"
            inputMode="numeric"
            min={1}
            max={720}
            aria-invalid={!!milestoneErrors?.reviewWindowHours}
            {...register(`milestones.${index}.reviewWindowHours`, {
              valueAsNumber: true,
            })}
          />
          <FieldDescription>72 ساعة مناسبة لمعظم مراحل العرض.</FieldDescription>
          <FieldError>{milestoneErrors?.reviewWindowHours?.message}</FieldError>
        </Field>
      </div>
    </FieldGroup>
  );
}

function AllocationSummary({
  totalAmount,
  allocation,
  milestones,
  onEqualDistribution,
}: {
  totalAmount: number;
  allocation: ReturnType<typeof getAllocation>;
  milestones: MilestoneDraft[];
  onEqualDistribution: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-4 sm:grid-cols-3">
          <InlineMetric label="إجمالي العقد" value={formatSar(totalAmount)} />
          <InlineMetric
            label="الموزع"
            value={formatSar(allocation.allocatedAmount)}
          />
          <InlineMetric
            label={allocation.isOverAllocated ? "تجاوز" : "المتبقي"}
            value={formatSar(
              allocation.isOverAllocated
                ? allocation.overAmount
                : allocation.remainingAmount,
            )}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEqualDistribution}
          disabled={!totalAmount}
        >
          توزيع متساو على {milestones.length} مراحل
        </Button>
      </div>
      <SegmentedAllocationBar
        totalAmount={totalAmount}
        milestones={milestones}
        allocation={allocation}
      />
      <div className="flex flex-col gap-2">
        <p
          className={cn(
            "text-muted-foreground text-sm leading-6",
            allocation.isOverAllocated && "text-destructive",
          )}
        >
          {allocation.isOverAllocated
            ? "المراحل تتجاوز إجمالي العقد. خفّض مبلغ مرحلة أو ارفع إجمالي العقد قبل الإرسال."
            : allocation.remainingAmount > 0
              ? "هناك مبلغ غير موزع. هذا مسموح، وسيظهر للطرف الآخر كسقف عقد أعلى من مبالغ المراحل الحالية."
              : "تم توزيع إجمالي العقد بالكامل على المراحل."}
        </p>
      </div>
    </section>
  );
}

function SegmentedAllocationBar({
  totalAmount,
  milestones,
  allocation,
}: {
  totalAmount: number;
  milestones: MilestoneDraft[];
  allocation: ReturnType<typeof getAllocation>;
}) {
  const denominator = Math.max(totalAmount, allocation.allocatedAmount, 1);
  const remainingPercent = (allocation.remainingAmount / denominator) * 100;

  return (
    <div className="bg-muted flex h-4 w-full overflow-hidden rounded-full">
      {milestones.map((milestone, index) => {
        const amount = numberOrZero(milestone.amount);
        const width = (amount / denominator) * 100;

        if (width <= 0) return null;

        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "focus-visible:ring-ring h-full min-w-2 outline-none focus-visible:ring-2",
                  milestoneColor(index),
                )}
                style={{ width: `${width}%` }}
                aria-label={`المرحلة ${index + 1}: ${textOr(
                  milestone.title,
                  `مرحلة ${index + 1}`,
                )}، ${formatSar(amount)}`}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-card text-card-foreground [&_svg]:bg-card [&_svg]:fill-card border px-3 py-2 shadow-lg">
              <span className="text-sm">
                المرحلة {index + 1}:{" "}
                {textOr(milestone.title, `مرحلة ${index + 1}`)} ·{" "}
                {formatSar(amount)}
              </span>
            </TooltipContent>
          </Tooltip>
        );
      })}
      {remainingPercent > 0 ? (
        <div
          className="bg-muted h-full"
          style={{ width: `${remainingPercent}%` }}
          aria-label={`غير موزع: ${formatSar(allocation.remainingAmount)}`}
        />
      ) : null}
    </div>
  );
}

function InlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="truncate text-lg font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b pb-3">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="truncate font-semibold">{value}</span>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}

function roleLabel(role?: CreateAndSendContractFormInput["creatorRole"]) {
  if (role === "PAYER_REVIEWER") return "ممول ومراجع";

  return "مقدم خدمة";
}

function providerLabel(values: {
  creatorRole?: CreateAndSendContractFormInput["creatorRole"];
  otherParty?: { name?: string };
}) {
  if (values.creatorRole === "PROVIDER") return "أنت";

  return textOr(values.otherParty?.name, "الطرف الآخر");
}

function payerLabel(values: {
  creatorRole?: CreateAndSendContractFormInput["creatorRole"];
  otherParty?: { name?: string };
}) {
  if (values.creatorRole === "PAYER_REVIEWER") return "أنت";

  return textOr(values.otherParty?.name, "الطرف الآخر");
}

function createBlankMilestone(): MilestoneDraft {
  return {
    title: "",
    description: "",
    amount: 0,
    deliverables: [{ title: "", description: "" }],
    acceptanceCriteria: [""],
    revisionsAllowed: 2,
    reviewWindowHours: 72,
  };
}

function getAllocation(
  totalAmount: number,
  milestones: Array<{ amount?: unknown }>,
) {
  const allocatedAmount = milestones.reduce(
    (sum, milestone) => sum + numberOrZero(milestone.amount),
    0,
  );
  const remainingAmount = Math.max(0, totalAmount - allocatedAmount);
  const overAmount = Math.max(0, allocatedAmount - totalAmount);
  const progressValue = totalAmount
    ? Math.min(100, Math.round((allocatedAmount / totalAmount) * 100))
    : 0;

  return {
    allocatedAmount,
    remainingAmount,
    overAmount,
    progressValue,
    isOverAllocated: overAmount > 0,
  };
}

function milestoneColor(index: number) {
  const colors = [
    "bg-primary",
    "bg-warning",
    "bg-success",
    "bg-destructive/70",
    "bg-foreground/70",
    "bg-ring",
  ];

  return colors[index % colors.length];
}

function getMilestoneMessage(errors: unknown) {
  if (!errors || typeof errors !== "object") return null;

  const message = "message" in errors ? errors.message : null;

  return typeof message === "string" ? message : null;
}

function numberOrZero(value: unknown) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function textOr(value: string | undefined, fallback: string) {
  return value?.trim() ? value : fallback;
}
