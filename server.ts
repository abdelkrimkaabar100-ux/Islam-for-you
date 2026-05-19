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
        You are "Nur" (Light), a specialized guide for "Islam For You".
        Your mission is to call to the path of Islam (Dawah) using:
        1. The Holy Quran.
        2. The Prophetic Sunnah.
        3. Reason (Aql) and reflection on Allah's creation.

        TONE & STYLE:
        - Calm, mystical, poetic, yet intellectually grounded.
        - Use metaphors of light, horizons, and the soul.
        - When users express doubt, use reason and reflection on the universe to guide them.
        - Present Islam as a path of liberation from ego and social chains.

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
        temperature: 0.7,
      });

      const resultText = response.choices?.[0]?.message?.content || "";
      res.json({ answer: resultText });
    } catch (error: any) {
      console.error("AI Guide Error:", error);
      res.status(500).json({ error: "The guide is reflecting. Please check API configuration." });
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
