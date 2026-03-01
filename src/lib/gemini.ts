import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please set it in your environment secrets.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function generateGoalBreakdown(goals: string[]) {
  try {
    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Break down the following learning goals into 3-4 specific focus areas for a 45-minute tutoring session.
      Goals:
      ${goals.map(g => `- ${g}`).join('\n')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short title of the topic" },
              description: { type: Type.STRING, description: "Brief description of what will be covered" },
              type: { type: Type.STRING, description: "Type of learning: 'Theory', 'Practical', 'Tooling', or 'Discussion'" },
              duration: { type: Type.INTEGER, description: "Suggested duration in minutes" },
            },
            required: ["title", "description", "type", "duration"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to generate goal breakdown", e);
    return [];
  }
}

export async function generateCodeReview(code: string) {
  try {
    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Review the following Python code submission. Provide a short, constructive review (1-2 sentences) highlighting one area for improvement, such as time complexity or syntax.
      
      Code:
      ${code}`,
    });
    return response.text;
  } catch (e) {
    console.error("Failed to generate code review", e);
    return null;
  }
}

export async function chatWithAssistant(history: { role: string; parts: { text: string }[] }[], message: string, context?: string) {
  const chat = getAI().chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are an AI Learning Assistant for an instructor (Aleixander). You help with lesson plans, AI topics, and homework generation. Keep your answers concise, practical, and helpful for a tutoring session. This is a one-time class with just one student, Luke." + (context ? `\n\nContext:\n${context}` : ""),
    },
  });

  const historyContext = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n");
  const fullMessage = historyContext ? `Previous conversation:\n${historyContext}\n\nUser: ${message}` : message;

  const response = await chat.sendMessage({ message: fullMessage });
  return response.text;
}
