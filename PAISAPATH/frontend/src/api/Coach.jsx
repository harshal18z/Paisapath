const express = require("express");
const fetch = require("node-fetch"); // Only needed if Node <18
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post("/", async (req, res) => {
  const { message, userContext } = req.body;

  if (!message || !userContext || !Array.isArray(userContext.transactions)) {
    return res.status(400).json({ reply: "Invalid request body" });
  }

  try {
    const prompt = `
      You are an AI finance coach helping a user manage money.
      Context: ${JSON.stringify(userContext)}
      User says: ${message}
      Give personalized, practical financial advice.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful finance coach." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(500).json({ reply: "AI Coach is temporarily unavailable." });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn’t process that right now.";
    res.json({ reply });

  } catch (error) {
    console.error("AI Coach Error:", error);
    res.status(500).json({ reply: "AI Coach is temporarily unavailable. Please try again later." });
  }
});

module.exports = router;