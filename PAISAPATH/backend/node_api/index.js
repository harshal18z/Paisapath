require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Only needed if Node <18

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 🔑 OpenAI Key Check
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("🔑 OpenAI Key Loaded:", OPENAI_API_KEY ? "Yes" : "No");

// 🧠 AI Chat Route
app.post("/api/chat", async (req, res) => {
  const { message, userContext } = req.body;

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }

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

// 🧾 Wallet Route
const walletRouter = require("./routes/wallet");
app.use("/api/v1/wallet", walletRouter);

// 🧠 Coach Route
const coachRouter = require("./routes/coach");
app.use("/api/coach", coachRouter);

// 📊 GetData Route
app.post("/getdata", (req, res) => {
  const { question, description, expenses, goal } = req.body;

  if (!question || !description || !expenses || typeof expenses !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const totalSpent = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const advice = totalSpent > goal
    ? "You're spending more than your goal. Consider cutting back on trips or groceries."
    : "You're within your goal. Great job!";

  res.json({ totalSpent, advice });
});

// 🏠 Root Route
app.get("/", (req, res) => {
  res.send("✅ AI Finance Coach backend is running");
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});