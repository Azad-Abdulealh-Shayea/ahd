"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/trpc/react";

export function AcceptContractDialog({ inviteToken }: { inviteToken: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [hasRead, setHasRead] = useState(false);
  const acceptInvite = api.contracts.acceptInvite.useMutation({
    onSuccess: (contract) => {
      toast.success("تم قبول العقد.");
      setOpen(false);
      router.push(`/dashboard/contracts/${contract.id}`);
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const isMatch = text === "أقبل هذا العقد";
  const canSubmit = hasRead && isMatch && !acceptInvite.isPending;

  const handleAccept = () => {
    if (!canSubmit) return;
    acceptInvite.mutate({ inviteToken });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setText("");
        setHasRead(false);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto">
          مراجعة وقبول العقد
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الموافقة على العقد</DialogTitle>
          <DialogDescription>
            بموافقتك على هذا العقد، أنت تلتزم بجميع الشروط، المراحل، ومعايير
            القبول المذكورة.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="bg-muted/50 flex items-start gap-3 rounded-2xl border p-4">
            <Checkbox
              id="read-terms"
              checked={hasRead}
              onCheckedChange={(checked) => setHasRead(checked === true)}
              className="mt-1"
            />
            <div className="flex flex-col gap-1.5 leading-none">
              <Label
                htmlFor="read-terms"
                className="cursor-pointer text-sm leading-snug font-semibold"
              >
                قرأت العقد وأتفهم جميع الشروط ومعايير القبول
              </Label>
              <p className="text-xs leading-relaxed opacity-80">
                أقر بأن النزاعات وطلبات التعديل ستتم بناءً على ما هو مكتوب في
                معايير القبول فقط. وأتفهم آلية التمويل وتسريح الدفعات.
              </p>
            </div>
          </div>

          <div
            className={`flex flex-col gap-3 transition-opacity duration-300 ${!hasRead ? "pointer-events-none opacity-40" : "opacity-100"}`}
          >
            <Label htmlFor="accept-text" className="text-sm leading-relaxed">
              للتأكيد النهائي، يرجى كتابة{" "}
              <strong className="bg-muted text-foreground rounded px-1.5 py-0.5 select-all">
                أقبل هذا العقد
              </strong>{" "}
              أدناه:
            </Label>
            <Input
              id="accept-text"
              placeholder="أقبل هذا العقد"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoComplete="off"
              disabled={!hasRead}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button variant="action" disabled={!canSubmit} onClick={handleAccept}>
            {acceptInvite.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : null}
            {acceptInvite.isPending ? "جاري القبول…" : "تأكيد القبول"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
