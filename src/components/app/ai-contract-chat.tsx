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
  prompt: string;
}> = [
  {
    title: "تصميم موقع",
    icon: "🌐",
    prompt: "أريد عقد تصميم موقع إلكتروني متجاوب للموبايل والكمبيوتر بمبلغ 5000 ريال. قسمه إلى مرحلتين: تصميم الواجهة (Figma) والتطوير البرمجي.",
  },
  {
    title: "تطوير تطبيق",
    icon: "📱",
    prompt: "قم بصياغة عقد تطوير تطبيق جوال لنظامي iOS و Android بمبلغ 15000 ريال. يشمل التصميم، التطوير، وتسليم الكود المصدري على 3 مراحل.",
  },
  {
    title: "تصميم شعار",
    icon: "🎨",
    prompt: "عقد تصميم شعار وهوية بصرية بمبلغ 2500 ريال، مرحلة أولى لتقديم المفاهيم ومرحلة ثانية لتطوير الشعار المختار مع التسليم النهائي.",
  },
  {
    title: "كتابة محتوى",
    icon: "✍️",
    prompt: "عقد كتابة محتوى تسويقي لـ 5 مقالات بمبلغ 2000 ريال، مرحلة واحدة وتسليم الملفات بصيغة PDF.",
  },
  {
    title: "استشارة",
    icon: "💡",
    prompt: "عقد جلسات استشارية تقنية بمبلغ 3000 ريال، المرحلة الأولى تحليل وتوصيات، والمرحلة الثانية متابعة ودعم لمدة شهر عبر 4 جلسات.",
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
    void handleSend(template.prompt);
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput ?? input.trim();
    if (!textToSend || isProcessing) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/ai/parse-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
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
      <div className="fixed end-4 bottom-24 z-[80] md:end-6 md:bottom-8 group">
        <div className="absolute -inset-1 animate-pulse rounded-full bg-primary/30 blur-md transition-all duration-500 group-hover:-inset-2 group-hover:bg-primary/40 group-hover:blur-xl" />
        <Button
          type="button"
          className="relative flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-br from-primary to-primary/80 px-6 font-bold shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 active:translate-y-0"
          onClick={handleToggle}
        >
          <HugeiconsIcon icon={SparklesIcon} className="size-5 text-yellow-300" />
          <span className="text-base text-primary-foreground tracking-wide">صغ عقدك مع وثيق</span>
        </Button>
      </div>
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
                onClick={() => void handleSend()}
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
