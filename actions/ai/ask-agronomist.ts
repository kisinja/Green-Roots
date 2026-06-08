"use server";

import {
  generateAgronomistResponse,
} from "@/lib/ai/assistant";

import { AIContext } from "@/lib/ai/types";

export async function askAgronomist(
  question: string,
  context: AIContext
) {
  return generateAgronomistResponse(
    question,
    context
  );
}