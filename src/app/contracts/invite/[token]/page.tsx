import { notFound } from "next/navigation";
import { LegalDocument01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { formatSar } from "@/features/contracts/display";
import { getContractInviteByToken } from "@/server/services/contract-workflow";
import { AcceptContractDialog } from "./accept-dialog";

export default async function ContractInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const contract = await getContractInviteByToken(token);

  if (!contract) notFound();

  const provider = contract.parties.find((party) => party.role === "PROVIDER");
  const payer = contract.parties.find((party) => party.role === "PAYER");

  return (
    <div className="bg-background text-foreground min-h-screen pb-28">
      <header className="bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
              <HugeiconsIcon icon={LegalDocument01Icon} />
            </span>
            عهد
          </div>
          <Badge variant="secondary">دعوة عقد</Badge>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-8">
        <section className="flex flex-col gap-6 border-b pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">بانتظار الموافقة</Badge>
            {payer ? (
              <span className="text-muted-foreground text-sm">
                المدعو: {payer.name}
              </span>
            ) : null}
          </div>
          <div className="flex max-w-4xl flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-normal text-balance md:text-5xl">
              {contract.title}
            </h1>
            <p className="text-muted-foreground text-base leading-8">
              {contract.description}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <InviteStat
              label="إجمالي العقد"
              value={formatSar(contract.totalAmount)}
            />
            <InviteStat
              label="عدد المراحل"
              value={`${contract.milestones.length}`}
            />
            <InviteStat label="العملة" value={contract.currency} />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_18rem]">
          <div className="flex flex-col gap-8">
            {contract.milestones.map((milestone, index) => (
              <article
                key={milestone.id}
                className="grid grid-cols-[2.75rem_1fr] gap-5"
              >
                <div className="flex flex-col items-center">
                  <span className="bg-background text-muted-foreground flex size-10 items-center justify-center rounded-full border text-sm font-semibold">
                    {index + 1}
                  </span>
                  {index < contract.milestones.length - 1 ? (
                    <span className="bg-border my-4 w-px flex-1" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-4 pb-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 flex-col gap-2">
                      <Badge variant="outline" className="w-fit">
                        المرحلة {index + 1}
                      </Badge>
                      <h2 className="text-2xl font-semibold">
                        {milestone.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-7">
                        {milestone.description}
                      </p>
                    </div>
                    <span className="text-xl font-semibold">
                      {formatSar(milestone.amount)}
                    </span>
                  </div>
                  <div className="grid gap-6 border-y py-5 md:grid-cols-2">
                    <MiniList
                      title="التسليمات"
                      items={milestone.deliverables.map((item) => item.title)}
                    />
                    <MiniList
                      title="معايير القبول"
                      items={milestone.acceptanceCriteria.map(
                        (item) => item.text,
                      )}
                    />
                  </div>
                  <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <span>التعديلات: {milestone.revisionsAllowed}</span>
                    <span>
                      نافذة المراجعة: {milestone.reviewWindowHours} ساعة
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="flex flex-col gap-6 lg:border-s lg:ps-6">
            {provider ? (
              <PartyBlock
                label="مقدم الخدمة"
                name={provider.name}
                email={provider.email}
              />
            ) : null}
            {payer ? (
              <PartyBlock
                label="الممول / المراجع"
                name={payer.name}
                email={payer.email}
              />
            ) : null}
          </aside>
        </section>
      </main>

      <div className="bg-background/95 fixed inset-x-0 bottom-0 z-20 border-t p-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl justify-end">
          <AcceptContractDialog inviteToken={token} />
        </div>
      </div>
    </div>
  );
}

function InviteStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-s ps-4 first:border-s-0 first:ps-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6">
            <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartyBlock({
  label,
  name,
  email,
}: {
  label: string;
  name: string;
  email: string;
}) {
  return (
    <section className="flex flex-col gap-1 border-b pb-4">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground text-sm">{email}</span>
    </section>
  );
}
