"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowUpIcon,
  Cancel01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useCreateContractFlow } from "@/features/contracts/components/create-contract-provider";
import type { CreateAndSendContractFormInput } from "@/features/contracts/schemas";

type AIChatMessage = {
  role: "user" | "assistant";
  content: string;
  showApplyButton?: boolean;
};

type AIContractChatProps = {
  onApplyContract: (values: Partial<CreateAndSendContractFormInput>) => void;
};

const contractTemplates: Array<{
  title: string;
  icon: string;
  data: Partial<CreateAndSendContractFormInput>;
}> = [
  {
    title: "تصميم موقع",
    icon: "🌐",
    data: {
      title: "تصميم موقع إلكتروني",
      description: "تصميم موقع إلكتروني متجاوب للموبايل والكمبيوتر",
      totalAmount: 5000,
      milestones: [
        {
          title: "تصميم الواجهة",
          description: "تصميم صفحات الموقع الرئيسية",
          amount: 2000,
          deliverables: [{ title: "تصميم Figma", description: "ملف التصميم" }],
          acceptanceCriteria: ["تصميم متجاوب", "يدعم اللغة العربية"],
          revisionsAllowed: 2,
          reviewWindowHours: 72,
        },
        {
          title: "التطوير",
          description: "تنفيذ الموقع برمجياً",
          amount: 3000,
          deliverables: [{ title: "الموقع", description: "رابط الموقع" }],
          acceptanceCriteria: ["الموقع يعمل", "الروابط سليمة"],
          revisionsAllowed: 2,
          reviewWindowHours: 72,
        },
      ],
    },
  },
  {
    title: "تطوير تطبيق",
    icon: "📱",
    data: {
      title: "تطوير تطبيق جوال",
      description: "تطبيق جوال لنظامي iOS و Android",
      totalAmount: 15000,
      milestones: [
        {
          title: "التصميم",
          description: "تصميم واجهات المستخدم",
          amount: 4000,
          deliverables: [{ title: "تصميم UI", description: "ملف Figma" }],
          acceptanceCriteria: ["شاشات أساسية", "دعم RTL"],
          revisionsAllowed: 2,
          reviewWindowHours: 72,
        },
        {
          title: "التطوير",
          description: "برمجة التطبيق",
          amount: 8000,
          deliverables: [{ title: "التطبيق", description: "ملف APK/IPA" }],
          acceptanceCriteria: ["التطبيق يعمل", "لا أخطاء"],
          revisionsAllowed: 2,
          reviewWindowHours: 72,
        },
        {
          title: "التسليم",
          description: "تسليم الكود والدعم",
          amount: 3000,
          deliverables: [{ title: "الكود", description: "رابط GitHub" }],
          acceptanceCriteria: ["كود موثق", "دعم 30 يوم"],
          revisionsAllowed: 1,
          reviewWindowHours: 72,
        },
      ],
    },
  },
  {
    title: "تصميم شعار",
    icon: "🎨",
    data: {
      title: "تصميم شعار",
      description: "تصميم هوية بصرية وشعار للشركة",
      totalAmount: 2500,
      milestones: [
        {
          title: "المفاهيم",
          description: "تصميم 3 مفاهيم أولية",
          amount: 1000,
          deliverables: [{ title: "المفاهيم", description: "3 تصاميم" }],
          acceptanceCriteria: ["3 تصاميم مميزة"],
          revisionsAllowed: 2,
          reviewWindowHours: 72,
        },
        {
          title: "التطوير",
          description: "تطوير الشعار المختار",
          amount: 1500,
          deliverables: [{ title: "الشعار النهائي", description: "ملفات SVG, PNG" }],
          acceptanceCriteria: ["ملفات بجودة عالية", "دعم الألوان"],
          revisionsAllowed: 3,
          reviewWindowHours: 72,
        },
      ],
    },
  },
  {
    title: "كتابة محتوى",
    icon: "✍️",
    data: {
      title: "كتابة محتوى",
      description: "كتابة محتوى تسويقي ومقالات",
      totalAmount: 2000,
      milestones: [
        {
          title: "المقالات",
          description: "كتابة 5 مقالات",
          amount: 2000,
          deliverables: [{ title: "المقالات", description: "ملفات PDF" }],
          acceptanceCriteria: ["5 مقالات", "300 كلمة لكل مقال"],
          revisionsAllowed: 2,
          reviewWindowHours: 72,
        },
      ],
    },
  },
  {
    title: "استشارة",
    icon: "💡",
    data: {
      title: "استشارة تقنية",
      description: "جلسات استشارية تقنية",
      totalAmount: 3000,
      milestones: [
        {
          title: "الجلسة الأولى",
          description: "تحليل المتطلبات وتوصيات",
          amount: 1500,
          deliverables: [{ title: "التقرير", description: "تقرير PDF" }],
          acceptanceCriteria: ["تقرير مفصل"],
          revisionsAllowed: 1,
          reviewWindowHours: 72,
        },
        {
          title: "المتابعة",
          description: "دعم ومتابعة لمدة شهر",
          amount: 1500,
          deliverables: [{ title: "الجلسات", description: "4 جلسات" }],
          acceptanceCriteria: ["4 جلسات استشارية"],
          revisionsAllowed: 0,
          reviewWindowHours: 72,
        },
      ],
    },
  },
];

export function AIContractChat({ onApplyContract }: AIContractChatProps) {
  const { setOpen: setSidebarOpen } = useSidebar();
  const { aiChatOpen: open, setAiChatOpen: setAiChatOpen } =
    useCreateContractFlow();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastParsedContract, setLastParsedContract] = useState<Partial<CreateAndSendContractFormInput> | null>(null);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (isOpen: boolean) => {
    setAiChatOpen(isOpen);
    setSidebarOpen(!isOpen);
  };

  const handleToggle = () => {
    handleOpenChange(!open);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTemplateSelect = (template: (typeof contractTemplates)[0]) => {
    onApplyContract(template.data);
    handleOpenChange(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/ai/parse-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        data?: {
          title?: string;
          totalAmount?: number;
          milestones?: Array<{ title?: string }>;
        };
        error?: string;
      };

      if (result.success && result.data) {
        const data = result.data;
        const parts: string[] = [];
        if (data.title) parts.push(`العقد: "${data.title}"`);
        if (data.totalAmount)
          parts.push(`المبلغ: ${data.totalAmount.toLocaleString()} ريال`);
        if (data.milestones) parts.push(`(${data.milestones.length} مراحل)`);

        const assistantMessage = `فهمت! سأقوم بتطبيق:\n${parts.join(" - ")}\n\n`;

        setLastParsedContract(result.data as Partial<CreateAndSendContractFormInput>);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: assistantMessage,
            showApplyButton: true,
          },
        ]);
      } else {
        const assistantMessage =
          result.error ??
          'لم أستطع فهم تفاصيل العقد بشكل كامل. يمكنك وصفه بوضوح أكثر.\n\nمثال: "عقد تصميم موقع بمبلغ 5000 ريال على 3 مراحل"';
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
        },
      ]);
    }

    setIsProcessing(false);
  };

  if (!open) {
    return (
      <Button
        type="button"
        className="fixed end-4 bottom-24 z-[80] shadow-lg md:end-6"
        size="lg"
        onClick={handleToggle}
      >
        <HugeiconsIcon icon={SparklesIcon} data-icon="inline-start" />
        وثيق
      </Button>
    );
  }

  return (
    <div className="bg-background fixed inset-y-0 end-0 z-[80] flex w-full max-w-sm flex-col border-s shadow-lg">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <HugeiconsIcon icon={SparklesIcon} className="text-primary" />
          وثيق
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => handleOpenChange(false)}
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-3">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon icon={SparklesIcon} className="size-8 text-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">مرحباً، أنا وثيق</h3>
                <p className="text-muted-foreground text-sm">
                  مساعدك الذكي لإنشاء العقود. اختر قالباً أو صِف عقدك.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {contractTemplates.map((template) => (
                  <button
                    key={template.title}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span>{template.icon}</span>
                    <span className="font-medium">{template.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-xl px-3 py-2 text-xs ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                {msg.showApplyButton && lastParsedContract && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full text-primary"
                    onClick={() => {
                      onApplyContract(lastParsedContract);
                      handleOpenChange(false);
                    }}
                  >
                    تطبيق على النموذج
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl px-3 py-2">
                <div className="flex gap-1">
                  <span className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full" />
                  <span
                    className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="صف عقدك: مثلاً أريد عقد تصميم موقع بمبلغ 5000 ريال على مرحلتين"
                className="bg-muted/50 focus:bg-muted min-h-[80px] max-h-[200px] w-full resize-none rounded-2xl border-0 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                disabled={isProcessing}
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                size="icon-sm"
                className="absolute bottom-3 end-3 size-8 rounded-full"
              >
                <HugeiconsIcon icon={ArrowUpIcon} className="size-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              اضغط Enter + Cmd/DCtrl للإرسال
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
