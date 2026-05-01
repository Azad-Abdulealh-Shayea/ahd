import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseContractWithAI } from "@/server/services/ai-contract";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { message: string };

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { success: false, error: "الرسالة مطلوبة" },
        { status: 400 }
      );
    }

    const result = await parseContractWithAI(body.message);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}