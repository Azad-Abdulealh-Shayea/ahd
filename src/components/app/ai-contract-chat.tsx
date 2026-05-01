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
};

type AIContractChatProps = {
  onApplyContract: (values: Partial<CreateAndSendContractFormInput>) => void;
};

export function AIContractChat({ onApplyContract }: AIContractChatProps) {
  const { setOpen: setSidebarOpen } = useSidebar();
  const { aiChatOpen: open, setAiChatOpen: setAiChatOpen } =
    useCreateContractFlow();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content:
        'مرحباً! أنا مساعد العقد الذكي. أخبرني عن العقد الذي تريد إنشاءه وسأساعدك في تعبئته. مثلاً: "أريد عقد تصميم موقع إلكتروني بمبلغ 5000 ريال على مراحل"',
    },
  ]);
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

  const parseContractFromMessage = (
    message: string,
  ): Partial<CreateAndSendContractFormInput> | null => {
    const result: Partial<CreateAndSendContractFormInput> = {};

    const titleMatch = /عقد\s+(.+?)(?:\s+بمبلغ|$)/i.exec(message);
    if (titleMatch?.[1]) {
      result.title = titleMatch[1].trim();
    } else {
      const simpleTitleMatch = /(?:صمم|أنشئ|أريد)\s+(.+?)(?:\s+مبلغ|$)/i.exec(
        message,
      );
      if (simpleTitleMatch?.[1]) {
        result.title = simpleTitleMatch[1].trim();
      }
    }

    const amountMatch = /(\d+[\d,]*)\s*(?:ريال|ر\.س)/i.exec(message);
    if (amountMatch?.[1]) {
      const amount = parseInt(amountMatch[1].replace(/,/g, ""), 10);
      result.totalAmount = amount;
    }

    const descriptionMatch = /وصف[:\s]+(.+?)(?:\n|$)/i.exec(message);
    if (descriptionMatch?.[1]) {
      result.description = descriptionMatch[1].trim();
    } else if (!result.title) {
      const lines = message.split("\n").filter((l) => l.trim());
      const firstLine = lines[0];
      if (firstLine) {
        result.title = firstLine.trim();
        if (lines.length > 1) {
          result.description = lines.slice(1).join(" ");
        }
      }
    }

    const milestonesMatch = /(\d+)\s*مراحل?/i.exec(message);
    if (milestonesMatch?.[1]) {
      const count = parseInt(milestonesMatch[1], 10);
      const milestoneNames = [
        "تصميم أولي",
        "التطوير",
        "المراجعة",
        "التسليم",
        "الدعم",
      ];
      const amountPerMilestone = result.totalAmount
        ? Math.round(result.totalAmount / count)
        : 1000;
      result.milestones = Array.from({ length: count }, (_, i) => ({
        title: milestoneNames[i] ?? `مرحلة ${i + 1}`,
        description: "",
        amount: amountPerMilestone,
        deliverables: [
          { title: milestoneNames[i] ?? `تسليم ${i + 1}`, description: "" },
        ],
        acceptanceCriteria: ["تسليم العمل المطلوب"],
        revisionsAllowed: 2,
        reviewWindowHours: 72,
      }));
    }

    if (Object.keys(result).length === 0) {
      return null;
    }

    return result;
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const parsed = parseContractFromMessage(userMessage);

    let assistantMessage = "";

    if (parsed && (parsed.title || parsed.totalAmount)) {
      const parts: string[] = [];
      if (parsed.title) parts.push(`العقد: "${parsed.title}"`);
      if (parsed.totalAmount)
        parts.push(`المبلغ: ${parsed.totalAmount.toLocaleString()} ريال`);
      if (parsed.milestones) parts.push(`(${parsed.milestones.length} مراحل)`);

      assistantMessage = `فهمت! سأقوم بتطبيق:\n${parts.join(" - ")}\n\nاضغط "تطبيق على النموذج" لإضافة هذه البيانات للعقد.`;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantMessage,
        },
        {
          role: "assistant",
          content: "🎉",
        },
      ]);
    } else {
      assistantMessage =
        'لم أستطع فهم تفاصيل العقد بشكل كامل. يمكنك وصفه بوضوح أكثر.\n\nمثال: "عقد تصميم موقع بمبلغ 5000 ريال على 3 مراحل"';
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    }

    setIsProcessing(false);
  };

  const handleApply = () => {
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    if (lastUserMessage) {
      const parsed = parseContractFromMessage(lastUserMessage.content);
      if (parsed) {
        onApplyContract(parsed);
        handleOpenChange(false);
      }
    }
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
        مساعد الذكاء الاصطناعي
      </Button>
    );
  }

  return (
    <div className="bg-background fixed inset-y-0 end-0 z-[80] flex w-full max-w-sm flex-col border-s shadow-lg">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <HugeiconsIcon icon={SparklesIcon} className="text-primary" />
          مساعد الذكاء الاصطناعي
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
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
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

        <div className="border-t p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="صف العقد..."
              className="bg-background focus:ring-primary flex-1 rounded-lg border px-3 py-2 text-xs outline-none focus:ring-2"
              disabled={isProcessing}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              size="icon-sm"
            >
              <HugeiconsIcon icon={ArrowUpIcon} className="size-4" />
            </Button>
          </div>
          <div className="mt-2 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleApply}
              className="text-primary"
            >
              تطبيق على النموذج
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
