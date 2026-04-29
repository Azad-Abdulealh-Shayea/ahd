import { z } from "zod";

const text = (label: string, max = 500) =>
  z.string().trim().min(1, `${label} مطلوب`).max(max, `${label} طويل جداً`);

function blankToUndefined(value: string | undefined) {
  if (value === "") return undefined;

  return value;
}

const optionalText = (max = 500) =>
  z.string().trim().max(max).optional().transform(blankToUndefined);

const sarAmount = z
  .number()
  .int("المبلغ يجب أن يكون رقماً صحيحاً")
  .positive("المبلغ يجب أن يكون أكبر من صفر")
  .max(1_000_000, "المبلغ كبير جداً لهذا العرض");

const deliverableSchema = z.object({
  title: text("اسم التسليم", 120),
  description: text("وصف التسليم", 500),
});

const milestoneSchema = z.object({
  title: text("اسم المرحلة", 120),
  description: text("وصف المرحلة", 800),
  amount: sarAmount,
  deliverables: z.array(deliverableSchema).min(1).max(5),
  acceptanceCriteria: z.array(text("معيار القبول", 300)).min(1).max(8),
  revisionsAllowed: z.number().int().min(0).max(10).default(2),
  reviewWindowHours: z.number().int().min(1).max(720).default(72),
});

export const createAndSendContractSchema = z
  .object({
    creatorRole: z.enum(["PROVIDER", "PAYER_REVIEWER"]),
    title: text("عنوان العقد", 160),
    description: text("وصف العقد", 1500),
    totalAmount: sarAmount,
    otherParty: z.object({
      name: text("اسم الطرف الآخر", 120),
      email: z.string().trim().email("البريد الإلكتروني غير صحيح"),
      phone: optionalText(40),
    }),
    milestones: z
      .array(milestoneSchema)
      .min(1, "أضف مرحلة واحدة على الأقل")
      .max(6, "الحد الأقصى ست مراحل"),
  })
  .superRefine((input, context) => {
    const allocatedAmount = input.milestones.reduce(
      (sum, milestone) => sum + milestone.amount,
      0,
    );

    if (allocatedAmount > input.totalAmount) {
      context.addIssue({
        code: "custom",
        path: ["milestones"],
        message: "مجموع مبالغ المراحل يتجاوز إجمالي العقد",
      });
    }
  });

export const contractIdSchema = z.object({
  contractId: text("معرف العقد", 80),
});

export const inviteTokenSchema = z.object({
  inviteToken: text("رمز الدعوة", 160),
});

export const milestoneActionSchema = z.object({
  contractId: text("معرف العقد", 80),
  milestoneId: text("معرف المرحلة", 80),
});

export const submitCompletionRequestSchema = milestoneActionSchema.extend({
  message: text("رسالة التسليم", 1500),
  deliverableUrl: z
    .string()
    .trim()
    .url("رابط التسليم غير صحيح")
    .optional()
    .or(z.literal(""))
    .transform(blankToUndefined),
  fileName: optionalText(160),
});

export const requestRevisionSchema = milestoneActionSchema.extend({
  acceptanceCriterionId: text("معيار القبول", 80),
  feedback: text("ملاحظات التعديل", 1500),
});

export const requestChangeOrderSchema = milestoneActionSchema.extend({
  title: text("عنوان طلب التغيير", 160),
  description: text("وصف طلب التغيير", 1500),
  amount: sarAmount,
});

export const openDisputeSchema = milestoneActionSchema.extend({
  acceptanceCriterionId: text("معيار القبول", 80),
  reason: text("سبب النزاع", 1500),
});

export type CreateAndSendContractInput = z.infer<
  typeof createAndSendContractSchema
>;
export type CreateAndSendContractFormInput = z.input<
  typeof createAndSendContractSchema
>;
export type MilestoneActionInput = z.infer<typeof milestoneActionSchema>;
export type SubmitCompletionRequestInput = z.infer<
  typeof submitCompletionRequestSchema
>;
export type RequestRevisionInput = z.infer<typeof requestRevisionSchema>;
export type RequestChangeOrderInput = z.infer<typeof requestChangeOrderSchema>;
export type OpenDisputeInput = z.infer<typeof openDisputeSchema>;
