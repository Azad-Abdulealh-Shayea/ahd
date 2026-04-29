import type {
  CreateAndSendContractFormInput,
  CreateAndSendContractInput,
} from "@/features/contracts/schemas";

export type CreateContractStep =
  | "role"
  | "contract"
  | "party"
  | "milestones"
  | "review";

export const createContractSteps: CreateContractStep[] = [
  "role",
  "contract",
  "party",
  "milestones",
  "review",
];

export const createContractStepLabels: Record<CreateContractStep, string> = {
  role: "الدور",
  contract: "العقد",
  party: "الطرف الآخر",
  milestones: "المراحل",
  review: "المراجعة",
};

export function isCreateContractStep(
  value: string,
): value is CreateContractStep {
  return createContractSteps.includes(value as CreateContractStep);
}

export function getDefaultCreateContractValues(
  creatorRole: CreateAndSendContractInput["creatorRole"] = "PROVIDER",
): CreateAndSendContractFormInput {
  return {
    creatorRole,
    title: "",
    description: "",
    totalAmount: 0,
    otherParty: {
      name: "",
      email: "",
      phone: "",
    },
    milestones: [
      {
        title: "",
        description: "",
        amount: 0,
        deliverables: [{ title: "", description: "" }],
        acceptanceCriteria: [""],
        revisionsAllowed: 2,
        reviewWindowHours: 72,
      },
    ],
  };
}

export const createContractStepFields: Record<
  CreateContractStep,
  Array<
    | "creatorRole"
    | "title"
    | "description"
    | "totalAmount"
    | "otherParty"
    | "milestones"
    | `otherParty.${string}`
    | `milestones.${number}.${string}`
  >
> = {
  role: ["creatorRole"],
  contract: ["title", "description", "totalAmount"],
  party: ["otherParty.name", "otherParty.email", "otherParty.phone"],
  milestones: ["milestones"],
  review: [
    "creatorRole",
    "title",
    "description",
    "totalAmount",
    "otherParty",
    "milestones",
  ],
};
