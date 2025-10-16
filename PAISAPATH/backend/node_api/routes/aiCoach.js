import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // loads .env

const router = express.Router();

router.post("/coach", async (req, res) => {
  const { message, userContext } = req.body;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    const prompt = `
      You are a personal finance AI coach.
      Context: ${JSON.stringify(userContext || {})}
      User says: ${message}
      Give clear, practical financial advice.
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or any model you have access to
        messages: [
          { role: "system", content: "You are a helpful AI finance coach." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t process that right now.";

    res.json({ reply });
  } catch (err) {
    console.error("AI Coach Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

export default router;
