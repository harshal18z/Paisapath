import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import GoalsGrid from "../components/GoalsGrid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard({ transactions = [] }) {
  // Load cashFlow from localStorage if available
  const [cashFlow, setCashFlow] = useState(() => {
    const saved = localStorage.getItem("cashFlow");
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [newPoint, setNewPoint] = useState({
    day: "",
    balance: "",
    spending: "",
    savings: "",
  });

  // Persist cashFlow to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cashFlow", JSON.stringify(cashFlow));
  }, [cashFlow]);

  // Listen for goals updates from other pages/tabs
  useEffect(() => {
    const handleStorage = () => {
      const updated = localStorage.getItem("goals");
      if (updated) setGoals(JSON.parse(updated));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Compute current balance from transactions
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const currentBalance = useMemo(() => totalIncome - totalExpense, [
    totalIncome,
    totalExpense,
  ]);

  const handleAddPoint = (e) => {
    e.preventDefault();
    if (!newPoint.day) return;

    const point = {
      day: newPoint.day,
      Balance: Number(newPoint.balance) || 0,
      Spending: Number(newPoint.spending) || 0,
      Savings: Number(newPoint.savings) || 0,
    };

    setCashFlow((prev) => [...prev, point]);
    setNewPoint({ day: "", balance: "", spending: "", savings: "" });
  };

  return (
    <motion.div
      className="space-y-6 p-6 min-h-screen"
      style={{ backgroundColor: "#F0F7EC" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-[#3E7C59]">Dashboard Overview</h1>

      {/* Balance & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F5F9E6] rounded-lg shadow p-5 flex flex-col justify-between border border-[#A8D5BA]">
          <h2 className="font-semibold text-[#3E7C59]">Current Balance</h2>
          <p className="text-3xl font-bold text-[#3E7C59] mt-2">
            ₹{currentBalance.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-[#F5F9E6] rounded-lg shadow p-5 flex flex-col justify-center items-center border border-[#A8D5BA]">
          <h2 className="font-semibold text-[#3E7C59] mb-1">AI Insight of the Day</h2>
          <p className="text-[#556B5A] text-center">Start saving towards your first goal today 💪</p>
        </div>

        <div className="bg-[#F5F9E6] rounded-lg shadow p-5 flex flex-col justify-center items-center border border-[#A8D5BA]">
          {goals.length > 0 ? (
            <GoalsGrid goals={goals} />
          ) : (
            <p className="text-[#3E7C59]">No goals yet — start by creating one 🎯</p>
          )}
        </div>
      </div>

      {/* Cash Flow Form */}
      <div className="bg-[#F5F9E6] rounded-lg shadow p-4 border border-[#A8D5BA]">
        <h2 className="text-xl font-semibold text-[#3E7C59] mb-3">Add Cash Flow Point</h2>
        <form onSubmit={handleAddPoint} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Day (Mon/Tue/... or date)"
            className="px-3 py-2 border rounded flex-1"
            value={newPoint.day}
            onChange={(e) => setNewPoint({ ...newPoint, day: e.target.value })}
          />
          <input
            type="number"
            placeholder="Balance"
            className="px-3 py-2 border rounded w-28"
            value={newPoint.balance}
            onChange={(e) => setNewPoint({ ...newPoint, balance: e.target.value })}
          />
          <input
            type="number"
            placeholder="Spending"
            className="px-3 py-2 border rounded w-28"
            value={newPoint.spending}
            onChange={(e) => setNewPoint({ ...newPoint, spending: e.target.value })}
          />
          <input
            type="number"
            placeholder="Savings"
            className="px-3 py-2 border rounded w-28"
            value={newPoint.savings}
            onChange={(e) => setNewPoint({ ...newPoint, savings: e.target.value })}
          />
          <button className="px-4 py-2 bg-[#A8D5BA] text-[#3E7C59] rounded hover:bg-[#8FCFA0] transition">
            Add
          </button>
        </form>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-[#F5F9E6] rounded-lg shadow p-6 border border-[#A8D5BA]">
        <h2 className="text-xl font-semibold mb-3 text-[#3E7C59]">Cash Flow Trend</h2>
        {cashFlow.length ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DFF4D8" />
              <XAxis dataKey="day" stroke="#3E7C59" />
              <YAxis stroke="#3E7C59" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Balance"
                stroke="#3E7C59"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line type="monotone" dataKey="Spending" stroke="#F7C8A0" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Savings" stroke="#6CC8A4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[#556B5A] italic">No cash flow data yet — add points above 👆</p>
        )}
      </div>
    </motion.div>
  );
}
