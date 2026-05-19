import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OpenAI/Groq setup
  const groqClient = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY || "dummy_key",
  });

  // Gemini API setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Guide Endpoint
  app.post("/api/ai-guide", async (req, res) => {
    try {
      const { message, history, language } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "Server: missing API key (GROQ_API_KEY)" });
      }

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
      res.json({ answer: resultText });
    } catch (error: any) {
      console.error("AI Guide Error:", error);
      const errorMessage = process.env.GROQ_API_KEY 
        ? "The guide is reflecting on the deep wisdom of the heavens. Please wait a moment."
        : "The light is dim. Please ensure GROQ_API_KEY is configured in Vercel or AI Studio secrets.";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Invitation Email Endpoint
  app.post("/api/invite-friend", async (req, res) => {
    try {
      const { recipient, language } = req.body;

      if (!recipient) {
        return res.status(400).json({ error: "Recipient is required" });
      }

      const prompt = `
        Generate a beautiful, warm, and inviting email to a friend named ${recipient}, inviting them to visit the "Nur Al-Huda" interactive exhibition about the life of the Prophet and the beauty of Islam.
        The tone should be friendly, appreciative, and informative.
        Respond in the language requested: ${language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : 'English'}.
        Include a subject line and the body.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.response.text();
      res.json({ email: text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate invitation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
