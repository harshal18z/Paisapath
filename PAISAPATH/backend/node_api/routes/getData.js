const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { question, description, expenses, goal } = req.body;

  if (!question || !description || !expenses) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const totalSpent = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const advice = totalSpent > goal
    ? "You're spending more than your goal. Consider cutting back on trips or groceries."
    : "You're within your goal. Great job!";

  res.json({ totalSpent, advice });
});

module.exports = router;