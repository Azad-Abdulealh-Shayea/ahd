import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Rocket01Icon,
  UserIcon,
  UserMultiple02Icon,
  Settings01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Ahd Start",
    nameEn: "Ahd Start",
    tagline: "لأول تجربة احترافية",
    taglineEn: "For first-time professionals",
    price: "0",
    priceUnit: "SAR",
    pricePeriod: "/شهر",
    periodEn: "/month",
    fee: "2%",
    feeNote: "على المدفوعات released",
    feeNoteEn: "on released payments",
    featured: false,
    icon: Rocket01Icon,
    color: "text-brand-navy",
    bg: "bg-brand-navy/10",
    border: "border-brand-navy/20",
    buttonVariant: "outline" as const,
    features: [
      { ar: "٣ عقود نشطة", en: "3 active contracts" },
      { ar: "مرحلتان لكل عقد", en: "2 milestones per contract" },
      { ar: "إنشاء عقود أساسي", en: "Basic contract creation" },
      { ar: "معايير قبول لكل مرحلة", en: "Definition of Done per milestone" },
      { ar: "٧٢ ساعة مهلة مراجعة", en: "72-hour review window" },
      { ar: "مراجعتان لكل مرحلة", en: "2 revisions per milestone" },
      { ar: "سجل تدقيق أساسي", en: "Basic audit trail" },
      { ar: "تدفق دفع/ضمان وهمي", en: "Mock escrow/payment flow" },
    ],
    limits: "بدون رسوم للعقود أقل من 200 SAR",
    limitsEn: "No fee for contracts under 200 SAR",
  },
  {
    name: "Ahd Pro",
    nameEn: "Ahd Pro",
    tagline: "للمستقلين الجاديين",
    taglineEn: "For serious freelancers",
    price: "49",
    priceUnit: "SAR",
    pricePeriod: "/شهر",
    periodEn: "/month",
    fee: "1%",
    feeNote: "بحد أقصى ١٠٠ SAR للعقد",
    feeNoteEn: "Max 100 SAR per contract",
    featured: true,
    icon: UserIcon,
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
    border: "border-brand-teal/30",
    buttonVariant: "default" as const,
    features: [
      { ar: "عقود غير محدودة", en: "Unlimited contracts" },
      { ar: "١٠ عقود ممولة نشطة", en: "10 active funded contracts" },
      { ar: "٥ مراحل لكل عقد", en: "5 milestones per contract" },
      { ar: "عدد مراجعات مخصص", en: "Custom revision count" },
      { ar: "مهلة مراجعة مخصصة", en: "Custom review window" },
      { ar: "صفحة عقد بالعلامة التجارية", en: "Branded contract page" },
      {
        ar: "قوالب عقود قابلة لإعادة الاستخدام",
        en: "Reusable contract templates",
      },
      { ar: "سجل العميل والدفعات", en: "Client & payment history" },
      { ar: "سجل تدقيق متقدم", en: "Advanced audit trail" },
      { ar: "أوامر التغيير", en: "Change orders" },
      { ar: "تدفق نزاع أساسي", en: "Basic dispute workflow" },
    ],
    limits: null,
    limitsEn: null,
  },
  {
    name: "Ahd Business",
    nameEn: "Ahd Business",
    tagline: "للأعمال والفرق",
    taglineEn: "For businesses & teams",
    price: "299",
    priceUnit: "SAR",
    pricePeriod: "/شهر",
    periodEn: "/month",
    fee: "0.5%",
    feeNote: "بحد أقصى ٢٥٠ SAR للعقد",
    feeNoteEn: "Max 250 SAR per contract",
    featured: false,
    icon: UserMultiple02Icon,
    color: "text-brand-gold",
    bg: "bg-brand-gold/10",
    border: "border-brand-gold/20",
    buttonVariant: "outline" as const,
    features: [
      { ar: "عقود غير محدودة", en: "Unlimited contracts" },
      {
        ar: "عقود ممولة نشطة غير محدودة",
        en: "Unlimited active funded contracts",
      },
      { ar: "١٥ مرحلة لكل عقد", en: "15 milestones per contract" },
      { ar: "٥ مقاعد فريق", en: "5 team seats" },
      { ar: "مقعد إضافي ٢٥٠ SAR/شهر", en: "Extra seat: 250 SAR/month" },
      { ar: "العلامة التجارية للشركة", en: "Company branding" },
      { ar: "قوالب عقود مخصصة", en: "Custom contract templates" },
      { ar: "أدوار موافقة", en: "Approval roles" },
      { ar: "تعيين مراجعين داخليين", en: "Internal reviewer assignment" },
      { ar: "أوامر تغيير متقدمة", en: "Advanced change orders" },
      { ar: "لوحة نزاع بالأدلة", en: "Dispute evidence panel" },
      { ar: "تصدير CSV/PDF", en: "CSV/PDF audit exports" },
      { ar: "دعم الأولوية", en: "Priority support" },
      { ar: "معاينة API webhook", en: "API webhook preview" },
    ],
    limits: null,
    limitsEn: null,
  },
  {
    name: "Ahd Enterprise",
    nameEn: "Ahd Enterprise",
    tagline: "للمنصات والمؤسسات",
    taglineEn: "For platforms & enterprises",
    price: "2,500+",
    priceUnit: "SAR",
    pricePeriod: "/شهر",
    periodEn: "/month",
    fee: "0.2-0.4%",
    feeNote: "أو تسعير مخصص",
    feeNoteEn: "Or custom pricing",
    featured: false,
    icon: Settings01Icon,
    color: "text-brand-charcoal",
    bg: "bg-brand-charcoal/10",
    border: "border-border",
    buttonVariant: "outline" as const,
    features: [
      { ar: "تدفقات عمل مخصصة", en: "Custom contract workflows" },
      { ar: "حدود مراحل مخصصة", en: "Custom milestone limits" },
      { ar: "سلاسل موافقة مخصصة", en: "Custom approval chains" },
      { ar: "وصول API", en: "API access" },
      { ar: "صفحات عقود white-label", en: "White-label contract pages" },
      { ar: "تكامل PSP/بنك/محفظة", en: "PSP/bank/wallet integration" },
      { ar: "تقارير مخصصة", en: "Custom reporting" },
      { ar: "دعم مخصص", en: "Dedicated support" },
      { ar: " SLA", en: "SLA" },
      { ar: "تصدير امتثال مخصص", en: "Custom compliance exports" },
    ],
    limits: null,
    limitsEn: null,
  },
];

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden font-sans">
      <nav className="bg-background/80 border-border/50 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-brand-navy dark:text-brand-ivory text-2xl font-bold tracking-tight">
            عهد | Ahd
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link href="/pricing">الأسعار</Link>
            </Button>
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link href="/login">الدخول</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-brand-navy text-brand-ivory hover:bg-brand-navy/90 dark:bg-brand-teal dark:text-brand-charcoal dark:hover:bg-brand-teal/90 px-6 text-base font-medium"
            >
              <Link href="/dashboard/contracts/new">إنشاء عقد</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <section className="flex flex-col items-center gap-8 text-center">
          <Badge
            variant="outline"
            className="text-brand-teal border-brand-teal/30 bg-brand-teal/5 rounded-full px-4 py-1.5 text-base font-medium"
          >
            Pricing Plans
          </Badge>
          <h1 className="text-brand-navy dark:text-brand-ivory text-5xl leading-tight font-extrabold tracking-tight text-balance md:text-6xl lg:text-7xl">
            اختر خطتك
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-xl leading-relaxed text-balance md:text-2xl">
            عهد مجاني للبدء، ويحصل على نسبة صغيرة فقط عند صرف مدفوعات المراحل
            الممولة.
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border-2 p-6 shadow-sm transition-all hover:shadow-lg ${
                plan.featured
                  ? "border-brand-teal bg-brand-teal/5 shadow-brand-teal/10"
                  : plan.border
              }`}
            >
              {plan.featured && (
                <Badge className="bg-brand-teal text-brand-charcoal absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-bold shadow-md">
                  الأكثر شعبية
                </Badge>
              )}

              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`${plan.bg} ${plan.color} flex size-12 items-center justify-center rounded-2xl`}
                >
                  <HugeiconsIcon icon={plan.icon} size={24} />
                </div>
                <div>
                  <h3 className="text-brand-navy dark:text-brand-ivory text-xl font-bold">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.taglineEn}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-brand-navy dark:text-brand-ivory text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-muted-foreground text-lg">
                      {plan.priceUnit}
                      {plan.pricePeriod}
                    </span>
                  )}
                  {plan.price === "0" && (
                    <span className="text-muted-foreground text-lg">/شهر</span>
                  )}
                </div>
                {plan.price !== "2,500+" && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {plan.priceUnit}
                    {plan.periodEn}
                  </p>
                )}
              </div>

              <div className="bg-muted/50 mb-6 rounded-2xl p-4">
                <p className="text-brand-navy dark:text-brand-ivory font-bold">
                  Ahd {plan.fee}
                </p>
                <p className="text-muted-foreground text-sm">
                  {plan.feeNoteEn}
                </p>
              </div>

              <div className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={20}
                      className="text-brand-teal mt-0.5 shrink-0"
                    />
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {feature.ar}
                    </span>
                  </div>
                ))}
                {plan.limits && (
                  <div className="bg-brand-gold/10 mt-4 rounded-xl p-3">
                    <p className="text-brand-navy dark:text-brand-ivory text-sm font-medium">
                      {plan.limits}
                    </p>
                  </div>
                )}
              </div>

              <Button
                className={`w-full ${plan.featured ? "bg-brand-teal text-brand-charcoal hover:bg-brand-teal/90" : ""}`}
                variant={plan.buttonVariant}
                asChild
              >
                <Link href="/login">
                  ابدأ الآن
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    className="mr-2"
                  />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <section className="flex flex-col gap-8 pt-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-brand-navy dark:text-brand-ivory text-3xl font-extrabold tracking-tight md:text-4xl">
              مقارنة تفصيلية
            </h2>
            <p className="text-muted-foreground text-lg">
              قارن الخطط واختر الأنسب لاحتياجاتك
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-fixed border-collapse">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground px-4 py-4 text-left text-sm font-semibold">
                    الميزة
                  </th>
                  <th className="text-brand-navy dark:text-brand-ivory px-4 py-4 text-center font-bold">
                    Start
                  </th>
                  <th className="text-brand-teal bg-brand-teal/5 px-4 py-4 text-center font-bold">
                    Pro
                  </th>
                  <th className="text-brand-gold px-4 py-4 text-center font-bold">
                    Business
                  </th>
                  <th className="text-muted-foreground px-4 py-4 text-center font-bold">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-border/50 border-b">
                  <td
                    className="text-foreground px-4 py-3 font-medium"
                    colSpan={5}
                  >
                    الأسعار والرسوم
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    السعر الشهري
                  </td>
                  <td className="text-brand-navy dark:text-brand-ivory px-4 py-3 text-center font-bold">
                    مجاني
                  </td>
                  <td className="text-brand-teal px-4 py-3 text-center font-bold">
                    49 SAR
                  </td>
                  <td className="text-brand-gold px-4 py-3 text-center font-bold">
                    299 SAR
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    2,500+ SAR
                  </td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    نسبة عهد على المدفوعات
                  </td>
                  <td className="px-4 py-3 text-center font-medium">2%</td>
                  <td className="px-4 py-3 text-center font-medium">1%</td>
                  <td className="px-4 py-3 text-center font-medium">0.5%</td>
                  <td className="px-4 py-3 text-center font-medium">
                    0.2-0.4%
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    الحد الأقصى للرسوم/عقد
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">100 SAR</td>
                  <td className="px-4 py-3 text-center">250 SAR</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>

                <tr className="border-border/50 border-b">
                  <td
                    className="text-foreground px-4 py-3 font-medium"
                    colSpan={5}
                  >
                    العقود والمراحل
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    العقود النشطة
                  </td>
                  <td className="px-4 py-3 text-center">3</td>
                  <td className="px-4 py-3 text-center">غير محدود</td>
                  <td className="px-4 py-3 text-center">غير محدود</td>
                  <td className="px-4 py-3 text-center">غير محدود</td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    العقود الممولة النشطة
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center">غير محدود</td>
                  <td className="px-4 py-3 text-center">غير محدود</td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    المراحل لكل عقد
                  </td>
                  <td className="px-4 py-3 text-center">2</td>
                  <td className="px-4 py-3 text-center">5</td>
                  <td className="px-4 py-3 text-center">15</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    قوالب العقود
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">مخصصة</td>
                </tr>

                <tr className="border-border/50 border-b">
                  <td
                    className="text-foreground px-4 py-3 font-medium"
                    colSpan={5}
                  >
                    المراجعات والنزاعات
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    عدد المراجعات
                  </td>
                  <td className="px-4 py-3 text-center">2</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    مهلة المراجعة
                  </td>
                  <td className="px-4 py-3 text-center">72 ساعة</td>
                  <td className="px-4 py-3 text-center">مخصصة</td>
                  <td className="px-4 py-3 text-center">مخصصة</td>
                  <td className="px-4 py-3 text-center">مخصصة</td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    أوامر التغيير
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">متقدم</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    تدفق النزاعات
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">أساسي</td>
                  <td className="px-4 py-3 text-center">مع لوحة الأدلة</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>

                <tr className="border-border/50 border-b">
                  <td
                    className="text-foreground px-4 py-3 font-medium"
                    colSpan={5}
                  >
                    الفريق والتعاون
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    مقاعد الفريق
                  </td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-center">5</td>
                  <td className="px-4 py-3 text-center">غير محدود</td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    أدوار الموافقة
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">مخصصة</td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    تعيين مراجعين داخليين
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                </tr>

                <tr className="border-border/50 border-b">
                  <td
                    className="text-foreground px-4 py-3 font-medium"
                    colSpan={5}
                  >
                    العلامة التجارية والتقارير
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    صفحة العقد بالعلامة
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">White-label</td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    سجل التدقيق
                  </td>
                  <td className="px-4 py-3 text-center">أساسي</td>
                  <td className="px-4 py-3 text-center">متقدم</td>
                  <td className="px-4 py-3 text-center">تصدير CSV/PDF</td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    تصدير التقارير
                  </td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">مخصص</td>
                </tr>

                <tr className="border-border/50 border-b">
                  <td
                    className="text-foreground px-4 py-3 font-medium"
                    colSpan={5}
                  >
                    API والتكامل
                  </td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">وصول API</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">معاينة</td>
                  <td className="px-4 py-3 text-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className="text-brand-teal mx-auto"
                    />
                  </td>
                </tr>
                <tr className="border-border/50 border-b">
                  <td className="text-muted-foreground px-4 py-3">
                    تكامل الدفع/الضمان
                  </td>
                  <td className="px-4 py-3 text-center">وهمي</td>
                  <td className="px-4 py-3 text-center">وهمي</td>
                  <td className="px-4 py-3 text-center">وهمي</td>
                  <td className="px-4 py-3 text-center">PSP/بنك/محفظة</td>
                </tr>
                <tr className="border-border/50 bg-muted/20 border-b">
                  <td className="text-muted-foreground px-4 py-3">الدعم</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">الأولوية</td>
                  <td className="px-4 py-3 text-center">مخصص + SLA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-border/60 bg-muted/30 rounded-3xl border-2 border-dashed p-8 text-center">
          <h3 className="text-brand-navy dark:text-brand-ivory mb-4 text-2xl font-bold">
            ملاحظة مهمة
          </h3>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
            رسوم مزود الدفع/الضمان منفصلة وتُ-passed transparent. عهد لا يحتفظ
            بالأموال sendiri؛ يتم إيداع funds في حساب وسيط مرخص، وعهد يتقاضى فقط
            عند صرف milestone payment.
          </p>
        </section>

        <section className="flex flex-col items-center gap-8 pt-8 text-center">
          <h2 className="text-brand-navy dark:text-brand-ivory text-4xl font-extrabold tracking-tight md:text-5xl">
            لديك سؤال؟
          </h2>
          <p className="text-muted-foreground max-w-2xl text-xl">
            تواصل معنا للحصول على تسعير مخصص أو إجابة على أسئلتك.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-full px-10 text-lg font-medium"
            asChild
          >
            <Link href="mailto:hello@ahd.sa">تواصل معنا</Link>
          </Button>
        </section>
      </div>

      <footer className="bg-brand-navy text-brand-ivory dark:bg-brand-charcoal dark:border-border mt-20 w-full rounded-t-[3rem] py-16 text-center md:rounded-t-[5rem] dark:border-t">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4">
          <p className="text-brand-ivory/60 text-sm">
            © 2026 Ahd. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
