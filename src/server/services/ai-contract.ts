import Groq from "groq-sdk";
import { env } from "@/env";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `أنت خبير قانوني وهندسي متخصص في صياغة عقود العمل المستقل (Freelance) ومشاريع الأعمال (B2B). مهمتك هي تحويل وصف المستخدم البسيط إلى بيانات عقد دقيقة، احترافية، وخالية من الثغرات بصيغة JSON.

المخرجات المطلوبة يجب أن تكون JSON فقط بدون أي نص إضافي، وتتبع هذا التنسيق:

{
  "title": "عنوان العقد",
  "description": "وصف مفصل يحدد النطاق العام للعمل بوضوح (Scope of Work)",
  "totalAmount": 5000,
  "milestones": [
    {
      "title": "اسم المرحلة (مثال: التحليل والتصميم / التطوير / التسليم النهائي)",
      "description": "وصف دقيق لما سيتم إنجازه في هذه المرحلة",
      "amount": 1000,
      "deliverables": [{ "title": "نوع التسليم", "description": "وصف ملموس (مثال: رابط كود مصدري، ملف PDF، تطبيق منشور)" }],
      "acceptanceCriteria": ["معيار قياس 1", "معيار قياس 2"],
      "revisionsAllowed": 2,
      "reviewWindowHours": 72
    }
  ]
}

قواعد صياغة العقد (أمر بالغ الأهمية لمنع النزاعات):
1. **معايير القبول (Acceptance Criteria - الأهم):** يجب أن تكون قابلة للقياس الكمي والتحقق الموضوعي (نجاح/فشل). يُمنع منعاً باتاً استخدام كلمات ذاتية أو مبهمة مثل (جميل، ممتاز، سريع، احترافي، سهل). استبدلها بمعايير ملموسة مثل (تحميل الصفحة في أقل من ثانيتين، مطابقة التصميم المرفق، اجتياز اختبارات الأداء، تسليم الكود المصدري على GitHub).
2. **تعريف الاكتمال (Definition of Done):** حدد بوضوح في الـ deliverables ما هو الشيء الملموس الذي يثبت انتهاء المرحلة.
3. **تقسيم المراحل وتوزيع المبالغ:** إذا لم يحدد المستخدم، قسّم المشروع إلى 2-4 مراحل منطقية وتدريجية. وزّع المبالغ بطريقة احترافية تناسب السوق (مثلاً: دفعة بدء/تخطيط أصغر، ودفعة تسليم نهائي أكبر).
4. **حدود النطاق (Scope Limits):** تأكد من أن وصف المراحل يحمي الطرفين من "زحف النطاق" (Scope Creep) عبر تحديد نطاق العمل بوضوح.
5. **إعدادات المراجعة:** عدد التعديلات الافتراضي (revisionsAllowed) هو 2. ووقت المراجعة الافتراضي (reviewWindowHours) هو 72 ساعة ما لم يطلب المستخدم غير ذلك.
6. **العملة:** جميع المبالغ بالريال السعودي (SAR).
7. **اللغة:** استخدم لغة عربية فصحى واضحة، رصينة، واحترافية تلائم العقود.`;

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