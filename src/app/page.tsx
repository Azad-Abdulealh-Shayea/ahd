import Link from "next/link";
import {
  DocumentValidationIcon,
  Shield02Icon,
  Time02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* Section 1: Navbar (Sticky, Ghost) */}
      <nav className="border-border/30 bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-brand-navy dark:text-brand-ivory text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            عهد | Ahd
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
              asChild
            >
              <Link href="/pricing">الأسعار</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
              asChild
            >
              <Link href="/login">الدخول</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-brand-navy text-brand-ivory hover:bg-brand-navy/90 dark:bg-brand-teal dark:text-brand-charcoal dark:hover:bg-brand-teal/90 px-4 text-sm font-medium"
            >
              <Link href="/login">ابدأ الآن</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-32 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        {/* Section 2: Hero */}
        <section className="relative flex flex-col items-start gap-8 pt-10">
          {/* Subtle Background Glow */}
          <div className="bg-brand-teal/15 pointer-events-none absolute -top-20 -right-20 -z-10 h-[400px] w-[400px] rounded-full opacity-70 blur-[100px] md:h-[600px] md:w-[600px]" />

          <Badge
            variant="outline"
            className="text-brand-teal border-brand-teal/30 bg-brand-teal/5 rounded-full px-4 py-1.5 text-base font-medium"
          >
            مُصمم للعمل المستقل والشركات
          </Badge>
          <h1 className="text-brand-navy dark:text-brand-ivory text-5xl leading-tight font-extrabold tracking-tight text-balance md:text-7xl lg:text-8xl">
            من اتفاق غير رسمي <br className="hidden md:block" />
            إلى عقد ممول.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-xl leading-relaxed text-balance md:text-2xl">
            اربط الدفعات بمعايير القبول. احمِ نفسك من التعديلات اللانهائية
            والاختفاء المفاجئ.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <Button
              size="lg"
              className="bg-brand-teal text-brand-ivory hover:bg-brand-teal/90 dark:bg-brand-teal dark:text-brand-charcoal dark:hover:bg-brand-teal/90 shadow-brand-teal/20 h-14 rounded-full px-10 text-lg font-bold shadow-lg"
              asChild
            >
              <Link href="/login">ابدأ الآن</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="hover:bg-brand-navy/5 h-14 rounded-full px-10 text-lg font-medium"
              asChild
            >
              <Link href="#how-it-works">كيف يعمل؟</Link>
            </Button>
          </div>
        </section>

        {/* Section 3: Mocked Contract (Inline UI Slice) */}
        <section className="border-brand-teal from-brand-teal/10 relative my-8 flex max-w-3xl flex-col items-start gap-6 rounded-l-3xl border-r-4 bg-gradient-to-l to-transparent py-10 pr-8 pl-4 shadow-sm md:pl-10">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-brand-navy dark:text-brand-ivory text-2xl font-bold md:text-3xl">
              المرحلة الأولى: تصميم الواجهة
            </h3>
            <Badge className="bg-funded text-funded-foreground hover:bg-funded/90 rounded-full border-transparent px-4 py-1 text-sm font-bold shadow-sm">
              الحالة: مُمولة
            </Badge>
          </div>
          <p className="text-brand-charcoal dark:text-brand-ivory text-4xl font-extrabold tracking-tight md:text-5xl">
            1,500 SAR
          </p>
          <div className="pt-4">
            <Button
              disabled
              variant="outline"
              size="lg"
              className="h-12 cursor-not-allowed border-2 border-dashed px-8 text-base font-semibold opacity-60"
            >
              تسليم العمل
            </Button>
          </div>
        </section>

        {/* Section 4: Features Grid */}
        <section className="grid gap-12 pt-8 md:grid-cols-3 md:gap-16">
          <div className="flex flex-col gap-5">
            <div className="text-brand-teal bg-brand-teal/10 flex size-14 items-center justify-center rounded-2xl shadow-sm">
              <HugeiconsIcon icon={Shield02Icon} size={32} />
            </div>
            <h2 className="text-brand-navy dark:text-brand-ivory text-2xl font-bold">
              نهاية للمراجعات اللانهائية
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              حدد عدد التعديلات المسموحة مسبقاً. أي طلب إضافي يتحول تلقائياً إلى
              أمر تغيير مدفوع.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-brand-gold bg-brand-gold/10 flex size-14 items-center justify-center rounded-2xl shadow-sm">
              <HugeiconsIcon icon={Time02Icon} size={32} />
            </div>
            <h2 className="text-brand-navy dark:text-brand-ivory text-2xl font-bold">
              حماية من التجاهل
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              مهلة مراجعة ٧٢ ساعة. إذا لم يرد الطرف الآخر، يتم اعتماد المرحلة
              وتحويل المبلغ تلقائياً.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-brand-navy dark:text-brand-soft-slate bg-brand-navy/10 dark:bg-brand-soft-slate/10 flex size-14 items-center justify-center rounded-2xl shadow-sm">
              <HugeiconsIcon icon={DocumentValidationIcon} size={32} />
            </div>
            <h2 className="text-brand-navy dark:text-brand-ivory text-2xl font-bold">
              معايير قبول واضحة
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              النزاعات لا تُبنى على المزاج. الموافقة والرفض مرتبطان بشروط تسليم
              مكتوبة.
            </p>
          </div>
        </section>

        {/* Section: The Cost of Informal Deals */}
        <section className="flex flex-col items-center justify-center py-16 text-center md:py-24">
          <h2 className="text-brand-navy dark:text-brand-ivory text-5xl leading-tight font-extrabold tracking-tight text-balance md:text-7xl lg:text-8xl">
            80% من المستقلين يعانون من{" "}
            <span className="text-brand-teal">توسع نطاق العمل</span> غير
            المدفوع.
          </h2>
          <p className="text-muted-foreground mt-8 max-w-3xl text-xl leading-relaxed text-balance md:text-3xl">
            عهد يحمي وقتك وجهدك عبر تحويل الاتفاقيات الشفهية إلى مسار عمل واضح
            ومُلزم.
          </p>
        </section>

        {/* Section: Feature Deep Dive 1 (Secure Funding) */}
        <section className="grid items-center gap-16 md:grid-cols-2 lg:gap-24">
          <div className="order-2 flex flex-col gap-6 md:order-1">
            <Badge
              variant="outline"
              className="text-brand-gold border-brand-gold/30 bg-brand-gold/5 w-fit rounded-full px-4 py-1.5 text-sm font-bold"
            >
              أمان مالي
            </Badge>
            <h2 className="text-brand-navy dark:text-brand-ivory text-4xl leading-tight font-extrabold text-balance md:text-5xl">
              تمويل يسبق العمل
            </h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              لا تبدأ العمل قبل أن تضمن حقك. يودع العميل قيمة المرحلة في حساب
              وسيط، وبمجرد تسليم العمل والموافقة عليه، يتم تحويل المبلغ لحسابك.
            </p>
          </div>
          <div className="bg-muted/50 text-muted-foreground border-border/60 order-1 flex aspect-video items-center justify-center rounded-3xl border-2 border-dashed text-lg font-medium shadow-sm md:order-2">
            GIF: Milestone Funding Flow
          </div>
        </section>

        {/* Section: Feature Deep Dive 2 (Revisions & Disputes) */}
        <section className="grid items-center gap-16 md:grid-cols-2 lg:gap-24">
          <div className="bg-muted/50 text-muted-foreground border-border/60 flex aspect-video items-center justify-center rounded-3xl border-2 border-dashed text-lg font-medium shadow-sm">
            GIF: Revision Counter & Dispute Modal
          </div>
          <div className="flex flex-col gap-6">
            <Badge
              variant="outline"
              className="text-brand-navy dark:text-brand-soft-slate border-brand-navy/30 dark:border-brand-soft-slate/30 bg-brand-navy/5 dark:bg-brand-soft-slate/5 w-fit rounded-full px-4 py-1.5 text-sm font-bold"
            >
              حدود واضحة
            </Badge>
            <h2 className="text-brand-navy dark:text-brand-ivory text-4xl leading-tight font-extrabold text-balance md:text-5xl">
              تعديلات بحدود، ونزاعات بالأدلة
            </h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              انتهى زمن &quot;تعديل بسيط أخير&quot;. حدد عدد التعديلات المسموحة
              في العقد. أي طلب إضافي يصبح أمر تغيير مدفوع، وأي نزاع يُحسم بناءً
              على معايير القبول المكتوبة.
            </p>
          </div>
        </section>

        {/* Section 5: Workflow */}
        <section id="how-it-works" className="flex flex-col gap-16 pt-16">
          <h2 className="text-brand-navy dark:text-brand-ivory text-4xl font-extrabold md:text-5xl">
            كيف يعمل عهد؟
          </h2>
          <div className="before:bg-border/60 relative flex flex-col gap-12 before:absolute before:inset-y-4 before:right-[27px] before:w-0.5">
            {[
              {
                num: "01",
                title: "الاتفاق",
                desc: "اكتب معايير القبول وعدد التعديلات المسموحة بوضوح.",
              },
              {
                num: "02",
                title: "التمويل",
                desc: "يودع العميل مبلغ المرحلة قبل بدء أي عمل لضمان الجدية.",
              },
              {
                num: "03",
                title: "التسليم",
                desc: "ارفع عملك للمراجعة. للعميل ٧٢ ساعة لاتخاذ إجراء.",
              },
              {
                num: "04",
                title: "التحويل",
                desc: "بمجرد الموافقة، يتم تحويل مستحقاتك إلى حسابك فوراً.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative z-10 flex items-start gap-8 md:gap-10"
              >
                <div className="bg-background border-brand-teal text-brand-teal shadow-brand-teal/10 flex size-14 shrink-0 items-center justify-center rounded-full border-[3px] text-lg font-black shadow-md">
                  {step.num}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <h3 className="text-brand-navy dark:text-brand-ivory text-2xl font-bold md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 6: CTA Footer */}
      <footer className="bg-brand-navy text-brand-ivory dark:bg-brand-charcoal dark:border-border mt-20 w-full rounded-t-[3rem] py-28 text-center md:rounded-t-[5rem] dark:border-t">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-6xl lg:text-7xl">
            مستعد لتحويل وعودك إلى عقود؟
          </h2>
          <p className="text-brand-ivory/80 mt-4 max-w-2xl text-xl leading-relaxed md:text-2xl">
            انضم الآن وابدأ العمل بأمان وضمان كامل لحقوقك، دون أي قلق من
            المراجعات اللانهائية أو اختفاء العملاء.
          </p>
          <div className="pt-8">
            <Button
              size="lg"
              className="bg-brand-teal text-brand-charcoal hover:bg-brand-teal/90 dark:bg-brand-teal dark:text-brand-charcoal shadow-brand-teal/10 h-16 rounded-full px-12 text-xl font-bold shadow-xl"
              asChild
            >
              <Link href="/dashboard/contracts/new">ابدأ الآن مجاناً</Link>
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
