import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateGoalBreakdown(goals: string[]) {
  const response = await ai.models.generateContent({
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

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse goal breakdown", e);
    return [];
  }
}

export async function generateCodeReview(code: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Review the following Python code submission. Provide a short, constructive review (1-2 sentences) highlighting one area for improvement, such as time complexity or syntax.
    
    Code:
    ${code}`,
  });
  return response.text;
}

export async function chatWithAssistant(history: { role: string; parts: { text: string }[] }[], message: string, context?: string) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are an AI Learning Assistant for an instructor (Aleixander). You help with lesson plans, AI topics, and homework generation. Keep your answers concise, practical, and helpful for a tutoring session. This is a one-time class with just one student, Luke." + (context ? `\n\nContext:\n${context}` : ""),
    },
  });

  // Replay history (simplified for this prototype, usually we'd pass history to create)
  // For a real app, we should pass history to `ai.chats.create({ history })` but the SDK might differ.
  // Let's just send the message with context.
  const historyContext = history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n");
  const fullMessage = historyContext ? `Previous conversation:\n${historyContext}\n\nUser: ${message}` : message;

  const response = await chat.sendMessage({ message: fullMessage });
  return response.text;
}
