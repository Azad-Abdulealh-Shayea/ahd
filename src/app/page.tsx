import Link from "next/link";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  LegalDocument01Icon,
  MoneySecurityIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const workflow = [
  {
    title: "عقد واضح",
    description: "الأطراف، المبلغ، المراحل، ومعايير القبول في مكان واحد.",
    icon: LegalDocument01Icon,
  },
  {
    title: "تمويل على مراحل",
    description: "كل دفعة مرتبطة بمرحلة محددة وليست بوعد شفهي.",
    icon: MoneySecurityIcon,
  },
  {
    title: "مراجعة قابلة للحسم",
    description:
      "الاعتماد، التعديل، التغيير المدفوع، والنزاع كلها مرتبطة بالمعايير.",
    icon: Task01Icon,
  },
];

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="bg-primary text-primary-foreground flex min-h-[70vh] flex-col justify-center gap-8 rounded-3xl border p-6 shadow-sm md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-contract-verified text-contract-verified-foreground">
              Ahd / عهد
            </Badge>
            <Badge className="bg-success text-success-foreground">
              عرض هاكاثون
            </Badge>
          </div>
          <div className="flex max-w-4xl flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-normal text-balance md:text-6xl">
              من اتفاق غير رسمي إلى عقد ممول قابل للتنفيذ.
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl text-base leading-8 md:text-lg">
              عهد يحول العمل المتفق عليه إلى مراحل، معايير قبول، وتمويل واضح
              يعرف كل طرف ما الذي ينتظره بعده.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="action" asChild>
              <Link href="/login">
                الدخول
                <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              asChild
            >
              <Link href="/dashboard/contracts/new">إنشاء عقد</Link>
            </Button>
          </div>
        </header>

        <Separator />

        <section className="grid gap-6 md:grid-cols-3">
          {workflow.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-4 border-b pb-5"
            >
              <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                <HugeiconsIcon icon={item.icon} />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-muted-foreground text-sm leading-7">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="bg-card flex flex-col gap-3 rounded-2xl border p-5 text-sm md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} />
            ابدأ بعقد جديد أو افتح لوحة القيادة.
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">فتح لوحة القيادة</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
