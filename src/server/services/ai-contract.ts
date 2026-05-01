import Groq from "groq-sdk";
import { env } from "@/env";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `أنت مساعد ذكي متخصص في إنشاء العقود. مهمتك هي تحويل وصف المستخدم إلى بيانات عقد JSON.

المخرجات المطلوبة يجب أن تكون JSON فقط بدون أي نص إضافي، وتتبع هذا التنسيق:

{
  "title": "عنوان العقد",
  "description": "وصف مختصر للعقد",
  "totalAmount": 5000,
  "milestones": [
    {
      "title": "اسم المرحلة",
      "description": "وصف المرحلة",
      "amount": 2500,
      "deliverables": [{ "title": "اسم التسليم", "description": "الوصف" }],
      "acceptanceCriteria": ["معيار 1", "معيار 2"],
      "revisionsAllowed": 2,
      "reviewWindowHours": 72
    }
  ]
}

القواعد:
- المبلغ بالريال السعودي (SAR)
- كل مرحلة يجب أن تحتوي على عنوان، وصف، مبلغ، تسليمات، معايير قبول
- عدد التعديلات الافتراضي: 2
- وزّع المبلغ بالتساوي على المراحل
- أضف معايير قبول منطقية حسب نوع العقد
- أضف تسليمات منطقية حسب نوع العمل`;

export async function parseContractWithAI(
  userDescription: string
): Promise<{
  success: boolean;
  data?: {
    title: string;
    description: string;
    totalAmount: number;
    milestones: Array<{
      title: string;
      description: string;
      amount: number;
      deliverables: Array<{ title: string; description: string }>;
      acceptanceCriteria: string[];
      revisionsAllowed: number;
      reviewWindowHours: number;
    }>;
  };
  error?: string;
}> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: userDescription,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: "لم يتم الحصول على رد من الذكاء الاصطناعي" };
    }

    const parsed = JSON.parse(content) as {
      title: string;
      description: string;
      totalAmount: number;
      milestones: Array<{
        title: string;
        description: string;
        amount: number;
        deliverables: Array<{ title: string; description: string }>;
        acceptanceCriteria: string[];
        revisionsAllowed?: number;
        reviewWindowHours?: number;
      }>;
    };

    const normalized = {
      title: parsed.title || "",
      description: parsed.description || "",
      totalAmount: parsed.totalAmount || 0,
      milestones: (parsed.milestones || []).map((m) => ({
        title: m.title || "",
        description: m.description || "",
        amount: m.amount || 0,
        deliverables: m.deliverables || [],
        acceptanceCriteria: m.acceptanceCriteria || [],
        revisionsAllowed: m.revisionsAllowed ?? 2,
        reviewWindowHours: m.reviewWindowHours ?? 72,
      })),
    };

    return { success: true, data: normalized };
  } catch (error) {
    console.error("AI parsing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ في معالجة الطلب",
    };
  }
}