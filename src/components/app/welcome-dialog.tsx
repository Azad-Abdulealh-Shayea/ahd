"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  LegalDocument01Icon,
  MoneySecurityIcon,
  Shield02Icon,
} from "@hugeicons/core-free-icons";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "أهلاً بك في عهد! 👋",
    description: (
      <>
        لا تقلق، نحن هنا لإرشادك خطوة بخطوة. عهد هو مساحتك الآمنة لتحويل
        الاتفاقيات الشفهية إلى مسار عمل واضح وممول يحمي حقوقك.
        <br />
        <br />
        <span className="text-brand-teal text-sm opacity-80">
          (وإذا كنت من لجنة تحكيم الهاكاثون، مرحباً بك.. لقد جهزنا كل شيء
          لتستمتع بالتجربة! 😉)
        </span>
      </>
    ),
    visual: (
      <div className="bg-brand-teal/10 text-brand-teal flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center">
        <HugeiconsIcon icon={LegalDocument01Icon} size={64} />
        <span className="text-xl font-bold">مسار عمل يحمي حقوقك</span>
      </div>
    ),
  },
  {
    id: 2,
    title: "تمويل يسبق العمل 💰",
    description:
      "لا تبدأ العمل على أمل أن يتم الدفع لاحقاً. في عهد، تحدد قيمة كل مرحلة، ويقوم العميل بإيداع المبلغ مسبقاً. لن يضيع جهدك أبداً.",
    visual: (
      <div className="bg-brand-gold/10 text-brand-gold flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center">
        <HugeiconsIcon icon={MoneySecurityIcon} size={64} />
        <span className="text-xl font-bold">ضمان مالي للمستقلين</span>
      </div>
    ),
  },
  {
    id: 3,
    title: "وداعاً للتعديلات اللانهائية 🛡️",
    description:
      "حدد عدد التعديلات المسموحة بوضوح في عقدك. أي طلب إضافي؟ يتحول تلقائياً إلى أمر تغيير مدفوع. نحن نحمي وقتك من التوسع غير المدفوع.",
    visual: (
      <div className="bg-brand-navy/10 text-brand-navy dark:text-brand-ivory flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center">
        <HugeiconsIcon icon={Shield02Icon} size={64} />
        <span className="text-xl font-bold">حدود واضحة لكل مشروع</span>
      </div>
    ),
  },
];

export function WelcomeDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem("ahd_onboarding_seen");
    if (!hasSeen) {
      setOpen(true);
    }

    // Listen for manual trigger
    const handleOpen = () => {
      setCurrentStep(0);
      setOpen(true);
    };

    window.addEventListener("open-welcome-dialog", handleOpen);
    return () => window.removeEventListener("open-welcome-dialog", handleOpen);
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("ahd_onboarding_seen", "true");
    setTimeout(() => setCurrentStep(0), 300); // Reset after animation
  };

  const startContract = () => {
    handleClose();
    router.push("/dashboard/contracts/new");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = steps[currentStep] ?? steps[0];

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="bg-background w-[95vw] !max-w-4xl gap-0 overflow-hidden rounded-3xl border-none p-0 shadow-2xl sm:!max-w-[800px] md:!max-w-[900px]"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>مرحباً بك في عهد</DialogTitle>
          <DialogDescription>
            مقدمة سريعة عن كيفية استخدام منصة عهد لضمان حقوقك
          </DialogDescription>
        </DialogHeader>
        <div className="grid min-h-[500px] md:grid-cols-2">
          {/* Visual Side */}
          <div className="hidden p-4 md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="h-full w-full"
              >
                {step?.visual}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Side */}
          <div className="flex flex-col justify-between p-8 md:p-10">
            {/* Header / Skip */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2" dir="ltr">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(i)}
                    aria-label={`الخطوة ${i + 1}`}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "bg-brand-teal w-8"
                        : "bg-muted-foreground/30 hover:bg-brand-teal/50 w-2"
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground font-medium"
              >
                تخطي
              </Button>
            </div>

            {/* Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex flex-col gap-6 pt-4"
              >
                <h2 className="text-brand-navy dark:text-brand-ivory text-3xl leading-tight font-bold">
                  {step?.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step?.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Visual (shows only on small screens) */}
            <div className="mt-6 h-48 md:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="h-full w-full"
                >
                  {step?.visual}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto flex items-center justify-between pt-8">
              {currentStep === steps.length - 1 ? (
                <div className="flex w-full items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-foreground font-bold"
                  >
                    ليس الآن
                  </Button>
                  <Button
                    onClick={startContract}
                    size="lg"
                    className="bg-brand-teal text-brand-charcoal hover:bg-brand-teal/90 rounded-full px-6 text-base font-bold shadow-lg"
                  >
                    إنشاء أول عقد
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="ms-2"
                    />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`text-brand-navy dark:text-brand-ivory font-bold ${currentStep === 0 ? "opacity-0" : "opacity-100"}`}
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="me-2" />
                    السابق
                  </Button>
                  <Button
                    onClick={nextStep}
                    size="lg"
                    className="rounded-full px-8 text-base font-bold"
                  >
                    التالي
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="ms-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
