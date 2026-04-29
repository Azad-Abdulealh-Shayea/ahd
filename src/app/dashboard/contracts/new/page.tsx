import Link from "next/link";
import { FileEditIcon, FilePlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

export default function NewContractIndexPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-normal">
          إنشاء عقد جديد
        </h1>
        <p className="text-muted-foreground text-sm leading-7">
          اختر طريقة الإدخال المناسبة. كلا المسارين ينشئان نفس العقد ويرسلانه
          للطرف الآخر.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/contracts/new/manual"
          className="bg-card hover:bg-muted/40 focus-visible:ring-ring rounded-2xl border p-5 transition-[background-color,box-shadow] outline-none focus-visible:ring-3"
        >
          <span className="flex flex-col gap-4">
            <HugeiconsIcon icon={FilePlusIcon} />
            <span className="flex flex-col gap-2">
              <span className="text-xl font-semibold">إنشاء يدوي</span>
              <span className="text-muted-foreground text-sm leading-7">
                نموذج واحد مباشر لمن يعرف تفاصيل العقد.
              </span>
            </span>
          </span>
        </Link>

        <Link
          href="/dashboard/contracts/new/wizard/role"
          className="bg-card hover:bg-muted/40 focus-visible:ring-ring rounded-2xl border p-5 transition-[background-color,box-shadow] outline-none focus-visible:ring-3"
        >
          <span className="flex flex-col gap-4">
            <HugeiconsIcon icon={FileEditIcon} />
            <span className="flex flex-col gap-2">
              <span className="text-xl font-semibold">خطوة بخطوة</span>
              <span className="text-muted-foreground text-sm leading-7">
                مسار موجه يقسم العقد إلى خطوات واضحة.
              </span>
            </span>
          </span>
        </Link>
      </section>

      <Button variant="ghost" className="w-fit" asChild>
        <Link href="/dashboard">العودة للوحة القيادة</Link>
      </Button>
    </main>
  );
}
