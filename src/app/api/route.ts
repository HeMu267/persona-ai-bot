// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { hiteshPersona } from "../../../public/hitesh.js";
import { piyushPersona } from "../../../public/piyush.js";

export const personas = {
  hiteshPersona: hiteshPersona,
  piyushPersona: piyushPersona,
};

const client = new OpenAI({
  apiKey: "AIzaSyBne_PhJWSouFqyUu5fT2N7BqVjS4fgO9Q", 
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

function buildSystemPrompt(persona: any) {
  let prompt = persona.system_instruction || "";

  if (persona.training_examples?.length) {
    prompt += "\n\nTraining Examples:\n";
    persona.training_examples.forEach((ex: any, idx: number) => {
      prompt += `Example ${idx + 1}:\n`;
      prompt += `User: ${ex.user_input}\n`;
      prompt += `Expected: ${ex.expected_response}\n`;
      prompt += `Context: ${ex.context}\n\n`;
    });
  }

  if (persona.social_media_context_examples?.length) {
    prompt += "\nSocial Media Context Examples:\n";
    persona.social_media_context_examples.forEach((ex: any, idx: number) => {
      prompt += `Platform: ${ex.platform}\n`;
      prompt += `Style: ${ex.style}\n`;
      prompt += `Example: ${ex.example}\n\n`;
    });
  }

  return prompt.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { messages, persona } = await req.json();
    //@ts-ignore
    const selectedPersona =personas[persona] || personas.hitesh;

    const completion = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: buildSystemPrompt(selectedPersona) },
        ...messages,
      ],
    });

    return NextResponse.json({
      reply: completion.choices[0].message?.content || "",
    });
  } catch (error) {
    console.error("Gemini Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
