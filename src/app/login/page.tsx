import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  LegalDocument01Icon,
  MoneySecurityIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentDemoUser } from "@/server/demo-session";
import { db } from "@/server/db";

export default async function LoginPage() {
  const [currentUser, demoUsers] = await Promise.all([
    getCurrentDemoUser(),
    db.demoUser.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-2xl">
            <HugeiconsIcon icon={LegalDocument01Icon} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
              اختر مستخدم العرض
            </h1>
            <p className="text-muted-foreground text-sm leading-7 md:text-base">
              جرّب عهد من منظور مقدمة الخدمة أو من منظور الممول والمراجع.
            </p>
          </div>
          {currentUser ? (
            <div className="bg-card flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm">
              <HugeiconsIcon icon={UserSwitchIcon} />
              <span className="text-muted-foreground">الجلسة الحالية:</span>
              <span className="font-medium">{currentUser.name}</span>
            </div>
          ) : null}
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {demoUsers.map((user) => {
            const isProvider = user.role === "PROVIDER";

            return (
              <Card key={user.id}>
                <CardHeader className="gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary text-secondary-foreground flex size-12 items-center justify-center rounded-2xl text-lg font-semibold">
                        {user.initials}
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <CardTitle className="truncate text-xl">
                          {user.name}
                        </CardTitle>
                        <CardDescription>{user.englishName}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={
                        isProvider
                          ? "bg-success text-success-foreground"
                          : "bg-funded text-funded-foreground"
                      }
                    >
                      {user.roleLabel}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <Separator />
                  <dl className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">الجهة</dt>
                      <dd className="font-medium">{user.organization}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">الدور</dt>
                      <dd className="font-medium">
                        {isProvider ? "تنشئ وتسلّم" : "تموّل وتراجع"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">البريد</dt>
                      <dd className="font-medium">{user.email}</dd>
                    </div>
                  </dl>
                </CardContent>

                <CardFooter>
                  <form action="/login/select" method="post" className="w-full">
                    <input type="hidden" name="userId" value={user.id} />
                    <Button className="w-full" size="lg">
                      دخول
                      <HugeiconsIcon
                        icon={isProvider ? ArrowLeft02Icon : MoneySecurityIcon}
                        data-icon="inline-end"
                      />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            );
          })}
        </section>

        {!demoUsers.length ? (
          <section className="text-muted-foreground border-y py-10 text-center text-sm">
            لا توجد حسابات متاحة.
          </section>
        ) : null}
      </div>
    </main>
  );
}
