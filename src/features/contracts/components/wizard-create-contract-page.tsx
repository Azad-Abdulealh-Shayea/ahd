"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Cancel01Icon,
  InformationCircleIcon,
  LegalDocument01Icon,
  Logout03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  AnimatePresence,
  heightReveal,
  motion,
  softScale,
} from "@/components/app/motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  ContractBasicsFields,
  ContractReviewSummary,
  MilestoneBuilder,
  OtherPartyFields,
  RoleFields,
} from "@/features/contracts/components/create-contract-fields";
import { useCreateContractFlow } from "@/features/contracts/components/create-contract-provider";
import {
  createContractStepLabels,
  createContractSteps,
  type CreateContractStep,
} from "@/features/contracts/create-contract-defaults";
import { cn } from "@/lib/utils";

const guidance: Record<
  CreateContractStep,
  {
    title: string;
    purpose: string;
    goodInput: string;
    avoid: string;
    later: string;
  }
> = {
  role: {
    title: "اختيار الدور",
    purpose:
      "هذه الخطوة تحدد من يقدم العمل ومن يمول ويراجع. بقية العقد ستستخدم هذا الدور لتفسير الصلاحيات.",
    goodInput:
      "اختر الدور التجاري الحقيقي في العقد، وليس فقط الشخص الذي يكتب النموذج الآن.",
    avoid:
      "لا تعكس الأدوار مجاملة للطرف الآخر. التمويل والمراجعة يجب أن يكونا عند الطرف الذي يقرر القبول.",
    later:
      "الدور يتحكم لاحقاً في التمويل، إرسال التسليمات، الاعتماد، طلب التعديل، وفتح النزاع.",
  },
  contract: {
    title: "أساس العقد",
    purpose:
      "اكتب عنواناً واضحاً ووصفاً يضع حدود العمل. إجمالي العقد هو سقف المبلغ الذي لا يجب أن تتجاوزه المراحل.",
    goodInput:
      "العنوان يصف النتيجة، والوصف يذكر النطاق والنتيجة النهائية بدون تفاصيل مشتتة.",
    avoid:
      "تجنب عناوين عامة مثل مشروع جديد، وتجنب وصف يخلط بين أعمال حالية وأعمال مستقبلية غير ممولة.",
    later:
      "إجمالي العقد سيظهر في المراجعة والتمويل. أي مبلغ غير موزع يبقى ظاهراً بدل أن يختفي.",
  },
  party: {
    title: "الطرف الآخر",
    purpose:
      "هذه البيانات تستخدم للدعوة ولعرض أطراف العقد. في العرض الحالي لا توجد مصادقة إنتاجية كاملة.",
    goodInput:
      "اكتب الاسم كما سيظهر في العقد، واستخدم بريداً واضحاً للطرف المدعو.",
    avoid:
      "لا تستخدم اسم شركة فقط إذا كان شخص محدد سيراجع ويمول أو يقدم التسليمات.",
    later:
      "بعد الإرسال سيستطيع الطرف الآخر قبول العقد، ثم تبدأ حالات التمويل والتنفيذ.",
  },
  milestones: {
    title: "بناء المراحل",
    purpose:
      "كل مرحلة هي وحدة تمويل ومراجعة مستقلة: مبلغ، تسليمات، معايير قبول، وعدد تعديلات.",
    goodInput:
      "اجعل كل مرحلة قابلة للحكم: ما الذي سيصل؟ كم قيمته؟ كيف نعرف أنه مقبول؟",
    avoid:
      "تجنب مراحل ضخمة بلا معايير، أو مراحل صغيرة لا تستحق دورة تمويل ومراجعة مستقلة.",
    later:
      "التعديلات والنزاعات ترتبط بمعايير القبول، والصرف لا يتم إلا بعد التمويل والاعتماد.",
  },
  review: {
    title: "المراجعة قبل الإرسال",
    purpose:
      "هذه معاينة للعقد كما سيُفهم لاحقاً: أطراف، إجمالي، توزيع مبالغ، ومراحل.",
    goodInput:
      "تأكد أن المجموع لا يتجاوز الإجمالي، وأن كل مرحلة لها تسليم ومعيار قبول واضح.",
    avoid:
      "لا ترسل عقداً بمعايير قبول غامضة؛ سيضعف ذلك مراجعة التسليم والنزاع لاحقاً.",
    later:
      "بعد الإرسال، الدعوة تقود الطرف الآخر للقبول ثم التمويل، ويبدأ سجل التدقيق بتوثيق الأحداث.",
  },
};

type StepDirection = 1 | -1;

const wizardStepSlide = {
  enter: (direction: StepDirection) => ({
    opacity: 0,
    x: direction === 1 ? 36 : -36,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32 },
  },
  exit: (direction: StepDirection) => ({
    opacity: 0,
    x: direction === 1 ? -36 : 36,
    transition: { duration: 0.22 },
  }),
};

export function WizardCreateContractPage({
  step,
}: {
  step: CreateContractStep;
}) {
  const router = useRouter();
  const { validateStep, submitContract, isSubmitting } =
    useCreateContractFlow();
  const stepIndex = createContractSteps.indexOf(step);
  const previousStep = createContractSteps[stepIndex - 1];
  const nextStep = createContractSteps[stepIndex + 1];
  const isReview = step === "review";
  const progress = ((stepIndex + 1) / createContractSteps.length) * 100;
  const [guidanceOpen, setGuidanceOpen] = useState(true);
  const [guidanceVisible, setGuidanceVisible] = useState(true);
  const previousStepIndexRef = useRef(stepIndex);
  const stepDirectionRef = useRef<StepDirection>(1);

  if (previousStepIndexRef.current !== stepIndex) {
    stepDirectionRef.current =
      stepIndex > previousStepIndexRef.current ? 1 : -1;
    previousStepIndexRef.current = stepIndex;
  }

  const stepDirection = stepDirectionRef.current;

  async function goNext() {
    const valid = await validateStep(step);
    if (!valid || !nextStep) return;

    router.push(`/dashboard/contracts/new/wizard/${nextStep}`);
  }

  return (
    <main className="bg-background fixed inset-0 z-[60] overflow-y-auto">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-4 md:px-6">
        <header className="flex flex-col gap-4 border-b pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="focus-visible:ring-ring flex w-fit items-center gap-2 rounded-full outline-none focus-visible:ring-3"
              aria-label="العودة للوحة القيادة"
            >
              <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full">
                <HugeiconsIcon icon={LegalDocument01Icon} />
              </span>
              <span className="flex flex-col">
                <span className="font-semibold">عهد</span>
                <span className="text-muted-foreground text-xs">
                  إنشاء عقد موجه
                </span>
              </span>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/dashboard/contracts/new">
                <HugeiconsIcon icon={Logout03Icon} data-icon="inline-start" />
                حفظ والخروج
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                الخطوة {stepIndex + 1} من {createContractSteps.length}
              </span>
              <span className="font-medium">
                {createContractStepLabels[step]}
              </span>
            </div>
            <Progress value={progress} />
            <WizardProgress currentStep={step} />
          </div>
        </header>

        <form
          className="grid flex-1 gap-8 pt-6 pb-28 lg:grid-cols-[minmax(0,1fr)_20rem]"
          onSubmit={(event) => {
            event.preventDefault();
            submitContract();
          }}
        >
          <div className="min-w-0 overflow-hidden">
            <AnimatePresence
              custom={stepDirection}
              initial={false}
              mode="wait"
            >
              <motion.section
                key={step}
                custom={stepDirection}
                initial="enter"
                animate="center"
                exit="exit"
                variants={wizardStepSlide}
                className="flex min-w-0 flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-semibold tracking-normal">
                    {createContractStepLabels[step]}
                  </h1>
                  <p className="text-muted-foreground max-w-2xl text-sm leading-7">
                    {guidance[step].purpose}
                  </p>
                </div>
                <StepFields step={step} />
              </motion.section>
            </AnimatePresence>
          </div>

          <GuidancePanel
            step={step}
            isOpen={guidanceOpen}
            isVisible={guidanceVisible}
            onToggle={() => setGuidanceOpen((value) => !value)}
            onClose={() => setGuidanceVisible(false)}
            onShow={() => {
              setGuidanceVisible(true);
              setGuidanceOpen(true);
            }}
          />
          <WizardActions
            previousStep={previousStep}
            nextStep={nextStep}
            isReview={isReview}
            isSubmitting={isSubmitting}
            onNext={goNext}
          />
        </form>
      </div>
    </main>
  );
}

function StepFields({ step }: { step: CreateContractStep }) {
  if (step === "role") return <RoleFields />;
  if (step === "contract") return <ContractBasicsFields />;
  if (step === "party") return <OtherPartyFields />;
  if (step === "milestones") return <MilestoneBuilder />;

  return <ContractReviewSummary />;
}

function WizardActions({
  previousStep,
  nextStep,
  isReview,
  isSubmitting,
  onNext,
}: {
  previousStep?: CreateContractStep;
  nextStep?: CreateContractStep;
  isReview: boolean;
  isSubmitting: boolean;
  onNext: () => void;
}) {
  return (
    <div className="bg-background/95 fixed inset-x-0 bottom-0 z-20 border-t px-4 py-3 backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {previousStep ? (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/contracts/new/wizard/${previousStep}`}>
              <HugeiconsIcon icon={ArrowRight02Icon} data-icon="inline-start" />
              السابق
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/dashboard/contracts/new">اختيار المسار</Link>
          </Button>
        )}

        {isReview ? (
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            إنشاء وإرسال العقد
          </Button>
        ) : (
          <Button type="button" onClick={onNext} disabled={!nextStep}>
            التالي
            <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  );
}

function WizardProgress({ currentStep }: { currentStep: CreateContractStep }) {
  const currentIndex = createContractSteps.indexOf(currentStep);

  return (
    <nav aria-label="خطوات إنشاء العقد" className="overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-2">
        {createContractSteps.map((step, index) => {
          const isCurrent = step === currentStep;
          const isPast = index < currentIndex;

          return (
            <li key={step} className="flex items-center gap-2">
              <Link
                href={`/dashboard/contracts/new/wizard/${step}`}
                className={cn(
                  "focus-visible:ring-ring flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm outline-none focus-visible:ring-3",
                  isCurrent && "bg-primary text-primary-foreground",
                  isPast && !isCurrent && "bg-muted",
                )}
              >
                <span>{index + 1}</span>
                <span>{createContractStepLabels[step]}</span>
              </Link>
              {index < createContractSteps.length - 1 ? (
                <span className="bg-border h-px w-6" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function GuidancePanel({
  step,
  isOpen,
  isVisible,
  onToggle,
  onClose,
  onShow,
}: {
  step: CreateContractStep;
  isOpen: boolean;
  isVisible: boolean;
  onToggle: () => void;
  onClose: () => void;
  onShow: () => void;
}) {
  const item = guidance[step];

  if (!isVisible) {
    return (
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={softScale}
        className="lg:sticky lg:top-6 lg:self-start"
      >
        <Button type="button" variant="outline" size="sm" onClick={onShow}>
          <HugeiconsIcon
            icon={InformationCircleIcon}
            data-icon="inline-start"
          />
          إظهار الإرشاد
        </Button>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={softScale}
      className="flex flex-col gap-5 border-t pt-6 lg:sticky lg:top-6 lg:self-start lg:border-t-0 lg:pt-0"
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="focus-visible:ring-ring flex min-w-0 flex-1 items-start gap-2 rounded-xl text-start outline-none focus-visible:ring-3"
          aria-expanded={isOpen}
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              "mt-1 shrink-0 transition-transform",
              !isOpen && "-rotate-90",
            )}
          />
          <span className="flex min-w-0 flex-col gap-2">
            <span className="text-muted-foreground text-sm">إرشاد اختياري</span>
            <span className="text-xl font-semibold">{item.title}</span>
          </span>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="إغلاق الإرشاد"
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="guidance-content"
            {...heightReveal}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5">
              <p className="text-muted-foreground text-sm leading-7">
                {item.purpose}
              </p>
              <Separator />
              <GuidanceBlock title="المدخل الجيد" body={item.goodInput} />
              <GuidanceBlock title="تجنب" body={item.avoid} />
              <GuidanceBlock title="الأثر لاحقاً" body={item.later} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.aside>
  );
}

function GuidanceBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm leading-7">{body}</p>
    </section>
  );
}
