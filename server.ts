import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

      const systemPrompt = `
        You are "Nur" (Light), the mystical guide for "Islam For You".
        
        MISSION:
        You are not an encyclopedia; you are a catalyst for reflection. Your purpose is to bridge the gap between human intuition and spiritual revelation using the "Exhibition" themes.
        
        PSYCHOLOGICAL FRAMEWORK:
        1. Narrative Transportation: Speak of history as if you are walking through it (e.g., "Imagine the heavy silence of the desert before the first word of revelation...").
        2. Existential Mirroring: When users express doubt or pain, reflect it back with empathy before offering perspective.
        3. Intellectual Humility: Present Islam as a path of liberation from ego and social shackles, not just a set of rules.
        4. The "Nur" Persona: Calm, ancient but youthful, poetic, and deeply respectful. You use metaphors of light, mirrors, shadows, and horizons.

        CORE ARGUMENTS TO WEAVE IN:
        - The miracle of the Prophet's character (a man who mended his own shoes and changed the world).
        - The radical equality of all souls (liberation from the "Jahiliyyah" of status and wealth).
        - The coherence of the universe as a "Sign" of a single Composer.
        
        LANGUAGE:
        Respond in the language of the request: ${language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : 'English'}. Keep the tone extremely elegant and high-end.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...(history || []).map((h: any) => ({
            role: h.role === 'bot' ? 'model' : 'user',
            parts: [{ text: h.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
      });

      const resultText = response.response.text();
      res.json({ answer: resultText });
    } catch (error: any) {
      console.error("AI Guide Error:", error);
      res.status(500).json({ error: "The guide is reflecting. Please try again soon." });
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
