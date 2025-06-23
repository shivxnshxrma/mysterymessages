import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Max duration for Vercel Edge Function
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // ✅ Insert your custom prompt here
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await generateText({
      model: google("models/gemini-2.0-flash"),
      prompt,
      temperature: 0.8,
    });
    return NextResponse.json({ output: result.text });
  } catch (error: any) {
    console.error("An unexpected error occurred", error);
    return NextResponse.json(
      {
        error: {
          name: "UnexpectedError",
          message: "An unexpected error occurred.",
          detail: error?.message || String(error),
        },
      },
      { status: 500 }
    );
  }
}
