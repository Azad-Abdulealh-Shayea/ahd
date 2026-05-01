import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ContractUserRole = "PROVIDER" | "PAYER_REVIEWER";
export type ContractDisplayStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED";
export type MilestoneDisplayStatus =
  | "AWAITING_FUNDING"
  | "FUNDED"
  | "IN_PROGRESS"
  | "COMPLETION_SUBMITTED"
  | "UNDER_REVIEW"
  | "REVISION_REQUESTED"
  | "CHANGE_REQUESTED"
  | "APPROVED"
  | "AUTO_APPROVED"
  | "DISPUTED";
export type PaymentDisplayStatus =
  | "UNFUNDED"
  | "FUNDED"
  | "RELEASE_PAUSED"
  | "RELEASED"
  | "REFUNDED";

type Tone = "neutral" | "primary" | "success" | "warning" | "destructive";

const contractStatusCopy: Record<
  ContractDisplayStatus,
  { label: string; tone: Tone; description: string }
> = {
  DRAFT: {
    label: "مسودة",
    tone: "neutral",
    description: "لم يُرسل العقد بعد. الخطوة التالية هي مراجعة الشروط وإرساله.",
  },
  SENT: {
    label: "مرسل",
    tone: "neutral",
    description: "العقد بانتظار قبول الطرف الآخر قبل التمويل أو التنفيذ.",
  },
  ACCEPTED: {
    label: "مقبول",
    tone: "primary",
    description: "تم قبول العقد. يمكن للممول بدء تمويل المرحلة الأولى.",
  },
  IN_PROGRESS: {
    label: "قيد التنفيذ",
    tone: "primary",
    description: "العقد نشط. تابع المرحلة الحالية حسب دورك في العقد.",
  },
  COMPLETED: {
    label: "مكتمل",
    tone: "success",
    description: "اكتملت كل المراحل وتم صرف الدفعات المستحقة.",
  },
  DISPUTED: {
    label: "نزاع مفتوح",
    tone: "destructive",
    description: "يوجد نزاع يوقف الصرف حتى يتم حله أو إلغاؤه.",
  },
  CANCELLED: {
    label: "ملغي",
    tone: "destructive",
    description: "تم إيقاف العقد ولا توجد إجراءات تنفيذ جديدة.",
  },
};

const milestoneStatusCopy: Record<
  MilestoneDisplayStatus,
  { label: string; tone: Tone; description: string }
> = {
  AWAITING_FUNDING: {
    label: "بانتظار التمويل",
    tone: "warning",
    description: "المرحلة لم تُمول بعد. ينتظر مقدم الخدمة التمويل للبدء.",
  },
  FUNDED: {
    label: "ممول",
    tone: "success",
    description: "المبلغ محجوز تجريبياً. مقدم الخدمة يستطيع إرسال التسليم.",
  },
  IN_PROGRESS: {
    label: "قيد التنفيذ",
    tone: "primary",
    description: "العمل جار على هذه المرحلة قبل إرسال التسليم للمراجعة.",
  },
  COMPLETION_SUBMITTED: {
    label: "تم التسليم",
    tone: "warning",
    description: "تم إرسال العمل. ينتظر المراجع اتخاذ قرار.",
  },
  UNDER_REVIEW: {
    label: "قيد المراجعة",
    tone: "warning",
    description: "التسليم ينتظر اعتماداً أو تعديلًا أو نزاعاً من المراجع.",
  },
  REVISION_REQUESTED: {
    label: "تعديل مطلوب",
    tone: "warning",
    description:
      "المراجع طلب تعديلاً مرتبطاً بمعيار قبول. ينتظر تسليم نسخة جديدة.",
  },
  CHANGE_REQUESTED: {
    label: "طلب تغيير",
    tone: "warning",
    description: "يوجد طلب عمل إضافي مدفوع خارج نطاق المرحلة الأصلية.",
  },
  APPROVED: {
    label: "معتمد",
    tone: "success",
    description: "تم اعتماد التسليم. يمكن الرجوع إليه للقراءة فقط.",
  },
  AUTO_APPROVED: {
    label: "اعتماد تلقائي",
    tone: "success",
    description: "انتهت نافذة المراجعة وتم اعتماد المرحلة تلقائياً.",
  },
  DISPUTED: {
    label: "متنازع عليه",
    tone: "destructive",
    description: "المرحلة متوقفة بسبب نزاع مفتوح مرتبط بمعيار قبول.",
  },
};

const paymentStatusCopy: Record<
  PaymentDisplayStatus,
  { label: string; tone: Tone; description: string }
> = {
  UNFUNDED: {
    label: "غير ممول",
    tone: "neutral",
    description: "لا يوجد مبلغ محجوز لهذه المرحلة بعد.",
  },
  FUNDED: {
    label: "ممول",
    tone: "success",
    description: "المبلغ محجوز تجريبياً ولا يُصرف إلا بعد الاعتماد.",
  },
  RELEASE_PAUSED: {
    label: "الصرف متوقف",
    tone: "destructive",
    description: "الصرف متوقف مؤقتاً بسبب نزاع أو توقف مراجعة.",
  },
  RELEASED: {
    label: "مصروف",
    tone: "success",
    description: "تم اعتماد المرحلة وصرف دفعتها التجريبية.",
  },
  REFUNDED: {
    label: "مسترد",
    tone: "neutral",
    description: "تمت إعادة المبلغ بدلاً من صرفه لمقدم الخدمة.",
  },
};

export const roleDisplay: Record<
  ContractUserRole,
  {
    label: string;
    shortLabel: string;
    eyebrow: string;
    heroClassName: string;
    borderClassName: string;
    accentClassName: string;
  }
> = {
  PROVIDER: {
    label: "مقدمة الخدمة",
    shortLabel: "مقدم خدمة",
    eyebrow: "مقدمة خدمة",
    heroClassName: "role-gradient-provider",
    borderClassName: "role-border-provider",
    accentClassName: "bg-success text-success-foreground",
  },
  PAYER_REVIEWER: {
    label: "الممول والمراجع",
    shortLabel: "ممول ومراجع",
    eyebrow: "ممول ومراجع",
    heroClassName: "role-gradient-payer",
    borderClassName: "role-border-payer",
    accentClassName: "bg-warning text-warning-foreground",
  },
};

export function formatSar(amount: number) {
  return new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "SAR",
  }).format(amount);
}

export function ContractStatusBadge({
  status,
}: {
  status: ContractDisplayStatus;
}) {
  const statusCopy = contractStatusCopy[status];

  return <ToneBadge tone={statusCopy.tone}>{statusCopy.label}</ToneBadge>;
}

export function MilestoneStatusBadge({
  status,
}: {
  status: MilestoneDisplayStatus;
}) {
  const statusCopy = milestoneStatusCopy[status];

  return <ToneBadge tone={statusCopy.tone}>{statusCopy.label}</ToneBadge>;
}

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentDisplayStatus;
}) {
  const statusCopy = paymentStatusCopy[status];

  return <ToneBadge tone={statusCopy.tone}>{statusCopy.label}</ToneBadge>;
}

export function getContractStatusDescription(status: ContractDisplayStatus) {
  return contractStatusCopy[status].description;
}

export function getMilestoneStatusDescription(status: MilestoneDisplayStatus) {
  return milestoneStatusCopy[status].description;
}

export function getPaymentStatusDescription(status: PaymentDisplayStatus) {
  return paymentStatusCopy[status].description;
}

export function ToneBadge({
  tone,
  className,
  children,
}: {
  tone: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant={tone === "neutral" ? "outline" : "secondary"}
      className={cn(
        tone === "primary" &&
          "bg-contract-active text-contract-active-foreground",
        tone === "success" &&
          "bg-contract-completed text-contract-completed-foreground",
        tone === "warning" &&
          "bg-contract-verified text-contract-verified-foreground",
        tone === "destructive" &&
          "bg-destructive/10 text-destructive border-destructive/20",
        className,
      )}
    >
      {children}
    </Badge>
  );
}
