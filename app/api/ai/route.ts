import { NextResponse } from "next/server";

import {
  generateAgronomistResponse,
} from "@/lib/ai/assistant";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const result =
      await generateAgronomistResponse(
        body.question,
        body.context
      );

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to generate response",
      },
      {
        status: 500,
      }
    );
  }
}