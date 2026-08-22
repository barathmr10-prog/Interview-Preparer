import { GoogleGenAI } from '@google/genai';

export const generateInterviewAnswer = async (question: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: "You are an interviewee in a job interview. I am the interviewer. Answer the question directly, clearly, and naturally, exactly as a strong candidate would speak in a real interview. Provide a good amount of context and detail to show your competence, but keep the length concise and avoid being overly verbose. Speak in the first person ('I'). CRITICAL: Your response must be a natural, spoken narrative in a linear paragraph format. Do NOT use bullet points, numbered lists, bold text, or any other structured formatting. Answer exactly as someone would talk out loud.",
      }
    });
    return response.text || "Could not generate an answer.";
  } catch (error) {
    console.error("Error generating answer:", error);
    throw new Error("Failed to generate answer. Please try again.");
  }
};
