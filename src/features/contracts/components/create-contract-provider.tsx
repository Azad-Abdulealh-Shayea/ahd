"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  type FieldErrors,
  type FieldPath,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getDefaultCreateContractValues,
  type CreateContractStep,
} from "@/features/contracts/create-contract-defaults";
import { predefinedContractTemplates } from "@/features/contracts/create-contract-templates";
import {
  createAndSendContractSchema,
  type CreateAndSendContractFormInput,
  type CreateAndSendContractInput,
} from "@/features/contracts/schemas";
import { api } from "@/trpc/react";

const storageKey = "ahd:create-contract-draft";

type CreateContractContextValue = {
  isSubmitting: boolean;
  fixedOtherParty: FixedOtherParty;
  glowUpdatedFields: (fields: string[]) => void;
  isFieldRecentlyUpdated: (name: string) => boolean;
  submitContract: () => void;
  validateFields: (
    fields: FieldPath<CreateAndSendContractFormInput>[],
  ) => Promise<boolean>;
  validateStep: (step: CreateContractStep) => Promise<boolean>;
  clearDraft: () => void;
};

const CreateContractContext = createContext<CreateContractContextValue | null>(
  null,
);

type FixedOtherParty = {
  name: string;
  email: string;
  phone?: string | null;
};

export function CreateContractProvider({
  children,
  defaultCreatorRole,
  fixedOtherParty,
}: {
  children: React.ReactNode;
  defaultCreatorRole: CreateAndSendContractInput["creatorRole"];
  fixedOtherParty: FixedOtherParty;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [isHydrated, setIsHydrated] = useState(false);
  const [updatedFieldKeys, setUpdatedFieldKeys] = useState<string[]>([]);
  const glowTimerRef = useRef<number | null>(null);
  const glowStartTimerRef = useRef<number | null>(null);
  const form = useForm<
    CreateAndSendContractFormInput,
    unknown,
    CreateAndSendContractInput
  >({
    resolver: zodResolver(createAndSendContractSchema),
    defaultValues: {
      ...getDefaultCreateContractValues(defaultCreatorRole),
      otherParty: toOtherPartyValues(fixedOtherParty),
    },
    mode: "onSubmit",
  });
  const values = useWatch({ control: form.control });
  const createMutation = api.contracts.createAndSend.useMutation({
    onSuccess: async (contract) => {
      clearDraft();
      await utils.contracts.list.invalidate();
      toast.success("تم إنشاء العقد وإرساله");
      router.push(`/dashboard/contracts/${contract.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "تعذر إنشاء العقد");
    },
  });

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);

    if (stored) {
      try {
        form.reset({
          ...(JSON.parse(stored) as CreateAndSendContractFormInput),
          otherParty: toOtherPartyValues(fixedOtherParty),
        });
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }

    setIsHydrated(true);
  }, [fixedOtherParty, form]);

  useEffect(() => {
    if (!isHydrated) return;

    form.setValue("otherParty", toOtherPartyValues(fixedOtherParty), {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [fixedOtherParty, form, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    sessionStorage.setItem(storageKey, JSON.stringify(values));
  }, [isHydrated, values]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty || createMutation.isPending) return;

      event.preventDefault();
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [createMutation.isPending, form.formState.isDirty]);

  useEffect(() => {
    return () => {
      if (glowTimerRef.current) window.clearTimeout(glowTimerRef.current);
      if (glowStartTimerRef.current) {
        window.clearTimeout(glowStartTimerRef.current);
      }
    };
  }, []);

  function clearDraft() {
    sessionStorage.removeItem(storageKey);
  }

  const glowUpdatedFields = useCallback((fields: string[]) => {
    const uniqueFields = Array.from(new Set(fields));

    if (glowTimerRef.current) window.clearTimeout(glowTimerRef.current);
    if (glowStartTimerRef.current) {
      window.clearTimeout(glowStartTimerRef.current);
    }

    setUpdatedFieldKeys([]);
    glowStartTimerRef.current = window.setTimeout(() => {
      setUpdatedFieldKeys(uniqueFields);
      glowTimerRef.current = window.setTimeout(() => {
        setUpdatedFieldKeys([]);
      }, 1150);
    }, 30);
  }, []);

  const isFieldRecentlyUpdated = useCallback(
    (name: string) =>
      updatedFieldKeys.some(
        (field) =>
          field === name ||
          name.startsWith(`${field}.`) ||
          field.startsWith(`${name}.`),
      ),
    [updatedFieldKeys],
  );

  const focusFirstError = useCallback(
    (errors: FieldErrors<CreateAndSendContractFormInput>) => {
      const firstName = findFirstErrorName(errors);

      if (firstName) {
        form.setFocus(firstName as FieldPath<CreateAndSendContractFormInput>);
      }
    },
    [form],
  );

  const value = useMemo<CreateContractContextValue>(
    () => ({
      isSubmitting: createMutation.isPending,
      fixedOtherParty,
      glowUpdatedFields,
      isFieldRecentlyUpdated,
      submitContract: () => {
        void form.handleSubmit(
          (input) =>
            createMutation.mutate({
              ...input,
              otherParty: toOtherPartyValues(fixedOtherParty),
            }),
          focusFirstError,
        )();
      },
      validateFields: async (fields) => {
        const valid = await form.trigger(fields, { shouldFocus: true });

        return valid;
      },
      validateStep: async (step) => {
        if (step === "role") {
          return form.trigger("creatorRole", { shouldFocus: true });
        }
        if (step === "contract") {
          return form.trigger(["title", "description", "totalAmount"], {
            shouldFocus: true,
          });
        }
        if (step === "party") {
          return form.trigger(
            ["otherParty.name", "otherParty.email", "otherParty.phone"],
            { shouldFocus: true },
          );
        }
        if (step === "milestones") {
          return form.trigger(["milestones", "totalAmount"], {
            shouldFocus: true,
          });
        }

        const valid = await form.trigger(undefined, { shouldFocus: true });

        if (!valid) {
          focusFirstError(form.formState.errors);
        }

        return valid;
      },
      clearDraft,
    }),
    [
      createMutation,
      fixedOtherParty,
      focusFirstError,
      form,
      glowUpdatedFields,
      isFieldRecentlyUpdated,
    ],
  );

  return (
    <CreateContractContext.Provider value={value}>
      <FormProvider {...form}>
        {children}
        <ContractTemplatePicker fixedOtherParty={fixedOtherParty} />
      </FormProvider>
    </CreateContractContext.Provider>
  );
}

export function useCreateContractFlow() {
  const value = useContext(CreateContractContext);

  if (!value) {
    throw new Error(
      "useCreateContractFlow must be used inside CreateContractProvider.",
    );
  }

  return value;
}

export function useFieldUpdateGlow(name: string) {
  const { isFieldRecentlyUpdated } = useCreateContractFlow();

  return isFieldRecentlyUpdated(name);
}

function findFirstErrorName(errors: FieldErrors, prefix = ""): string | null {
  for (const [key, value] of Object.entries(errors)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (!value) continue;

    if ("message" in value && value.message) {
      return path;
    }

    const nested = findFirstErrorName(value as FieldErrors, path);

    if (nested) return nested;
  }

  return null;
}

function ContractTemplatePicker({
  fixedOtherParty,
}: {
  fixedOtherParty: FixedOtherParty;
}) {
  const form = useFormContext<CreateAndSendContractFormInput>();
  const { glowUpdatedFields } = useCreateContractFlow();

  function applyTemplate(templateId: string) {
    const template = predefinedContractTemplates.find(
      (item) => item.id === templateId,
    );
    if (!template) return;

    const current = form.getValues();
    form.reset({
      ...current,
      ...template.values,
      creatorRole: current.creatorRole,
      otherParty: toOtherPartyValues(fixedOtherParty),
    });
    glowUpdatedFields([
      "title",
      "description",
      "totalAmount",
      "milestones",
    ]);
    toast.success("تم تعبئة العقد التجريبي");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="fixed end-4 bottom-24 z-[80] shadow-lg md:end-6"
          size="lg"
        >
          <HugeiconsIcon icon={SparklesIcon} data-icon="inline-start" />
          عقود جاهزة
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="z-[90] w-[min(24rem,calc(100vw-2rem))] p-0"
      >
        <div className="flex flex-col">
          <div className="border-b p-4">
            <h2 className="font-semibold">اختر عقداً جاهزاً</h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              يملأ العنوان، الوصف، المبلغ، والمراحل كاملة.
            </p>
          </div>
          <div className="max-h-[min(28rem,70vh)] overflow-y-auto">
            {predefinedContractTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                className="hover:bg-muted/60 focus-visible:ring-ring flex w-full flex-col gap-2 border-b p-4 text-start outline-none last:border-b-0 focus-visible:ring-2"
                onClick={() => applyTemplate(template.id)}
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="font-medium">{template.title}</span>
                  <Badge variant="outline">
                    {template.values.milestones.length} مراحل
                  </Badge>
                </span>
                <span className="text-muted-foreground text-sm leading-6">
                  {template.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function toOtherPartyValues(fixedOtherParty: FixedOtherParty) {
  return {
    name: fixedOtherParty.name,
    email: fixedOtherParty.email,
    phone: fixedOtherParty.phone ?? "",
  };
}
