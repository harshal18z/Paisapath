const express = require("express");
const router = express.Router();

// In-memory storage (replace with database later)
const userWallets = {};
const userGoals = {};

// --------------------
// Add transactions and/or goals
// POST /api/wallet
// --------------------
router.post("/", (req, res) => {
  const { userId, transactions, goals } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // Initialize user storage
  if (!userWallets[userId]) userWallets[userId] = [];
  if (!userGoals[userId]) userGoals[userId] = [];

  // Add transactions if provided
  if (Array.isArray(transactions)) {
    userWallets[userId].push(...transactions);
  }

  // Add goals if provided
  if (Array.isArray(goals)) {
    userGoals[userId].push(...goals);
  }

  // Calculate totals
  const income = userWallets[userId]
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = userWallets[userId]
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  res.json({
    userId,
    income,
    expense,
    balance,
    transactions: userWallets[userId],
    goals: userGoals[userId],
    message: "Wallet updated successfully",
  });
});

// --------------------
// Get user wallet and goals
// GET /api/wallet/:userId
// --------------------
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const transactions = userWallets[userId] || [];
  const goals = userGoals[userId] || [];

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  res.json({ userId, transactions, goals, income, expense, balance });
});

module.exports = router;
