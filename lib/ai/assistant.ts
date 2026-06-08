import OpenAI from "openai";

import { retrieveKnowledge } from "./retrieval";
import { SYSTEM_PROMPT } from "./prompts";

import {
    AIResponseSchema,
} from "./schemas";

import {
    AIContext,
    AIResponse,
} from "./types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAgronomistResponse(
    question: string,
    context: AIContext
): Promise<AIResponse> {
    const knowledge =
        await retrieveKnowledge(question);

    const prompt = `
QUESTION:
${question}

CONTEXT:
${JSON.stringify(context)}

PRODUCTS:
${JSON.stringify(knowledge.products)}

CROPS:
${JSON.stringify(knowledge.crops)}

DISEASES:
${JSON.stringify(
        knowledge.diseases
    )}

BLOGS:
${JSON.stringify(
        knowledge.blogs
    )}
`;

    const completion =
        await openai.chat.completions.create({
            model: "gpt-5",

            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },

                {
                    role: "user",
                    content: prompt,
                },
            ],

            response_format: {
                type: "json_object",
            },
        });

    const content =
        completion.choices[0]
            .message.content;

    const parsed =
        AIResponseSchema.parse(
            JSON.parse(content || "{}")
        );

    return parsed;
}