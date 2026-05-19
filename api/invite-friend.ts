import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipient, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY environment variable" });
    }

    const ai = new GoogleGenAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Generate a beautiful, warm, and inviting email to a friend named ${recipient}, inviting them to visit the "Nur Al-Huda" interactive exhibition about the life of the Prophet and the beauty of Islam.
      The tone should be friendly, appreciative, and informative.
      Respond in the language requested: ${language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : 'English'}.
      Include a subject line and the body.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ email: text });
  } catch (error: any) {
    console.error("Invite Error:", error);
    return res.status(500).json({ error: "Failed to generate invitation" });
  }
}
