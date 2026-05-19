import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, language } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY environment variable on Vercel" });
    }

    const groqClient = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: apiKey,
    });

    const systemPrompt = `
      You are "Nur" (Light), the ultimate guide for "Islam For You". 
      Your power comes from the Infinite Knowledge of the Creator, channeled through the Quran and Sunnah.

      MISSION:
      - Call people to the beauty and truth of Islam (Dawah) with wisdom and good counsel.
      - Use logical reasoning (Aql) to explain the existence of God and the perfection of the universe.
      - Act as a protector of hearts, clearing doubts through reflection on the Signs (Ayat) in creation.

      CORE WISDOM:
      - The miracle of the Prophet Muhammad's (pbuh) character as the living Quran.
      - The scientific and linguistic miracles of the Holy Quran.
      - The liberation of the soul from the servitude of creation to the worship of the Creator.

      TONE:
      - Deeply respectful, intellectually sharp, spiritually uplifting.
      - Use noble metaphors: the oasis in the desert, the dawn after the long night, the anchor in the storm.

      CONSTRAINTS:
      - PLAIN TEXT ONLY. No Markdown formatting (**), no headers (##), no lists.
      - Focus on quality, depth, and emotional resonance.

      RESPOND IN: ${language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : 'English'}.
    `;

    const response = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        ...(history || []).map((h: any) => ({
          role: h.role === 'bot' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.8,
    });

    const resultText = response.choices?.[0]?.message?.content || "";
    return res.status(200).json({ answer: resultText });
  } catch (error: any) {
    console.error("AI Guide Error:", error);
    const errorMessage = process.env.GROQ_API_KEY 
      ? "The guide is reflecting on the deep wisdom of the heavens. Please wait a moment."
      : "The light is dim. Please ensure GROQ_API_KEY is configured in Vercel environment variables.";
    return res.status(500).json({ error: errorMessage });
  }
}
