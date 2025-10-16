import React, { useState, useEffect } from "react";
import { FaTrash, FaStar } from "react-icons/fa";

export default function Goals() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [formData, setFormData] = useState({
    name: "",
    target: "",
    saved: "",
    dueDate: "",
  });

  // Persist goals whenever they change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target) return;

    const newGoal = {
      id: Date.now(),
      name: formData.name,
      target: Number(formData.target),
      saved: Number(formData.saved || 0),
      dueDate: formData.dueDate || "",
    };

    setGoals([newGoal, ...goals]);
    setFormData({ name: "", target: "", saved: "", dueDate: "" });
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const getProgressColor = (percent) => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-400";
    if (percent >= 25) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#F0F7EC" }}>
      <h1 className="text-3xl font-bold text-[#14532D] mb-6">My Goals</h1>

      {/* Add Goal Form */}
      <form
        onSubmit={addGoal}
        className="bg-[#F5F9E6] p-6 rounded-xl shadow border border-[#A3D9A5] flex flex-wrap gap-3 items-end mb-6"
      >
        <input
          type="text"
          placeholder="Goal Name"
          className="flex-1 p-3 border rounded-lg border-[#A3D9A5] focus:ring-2 focus:ring-[#81C784]"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Target Amount"
          className="p-3 border rounded-lg w-36 border-[#A3D9A5] focus:ring-2 focus:ring-[#81C784]"
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
        />
        <input
          type="number"
          placeholder="Saved Amount"
          className="p-3 border rounded-lg w-36 border-[#A3D9A5] focus:ring-2 focus:ring-[#81C784]"
          value={formData.saved}
          onChange={(e) => setFormData({ ...formData, saved: e.target.value })}
        />
        <input
          type="date"
          className="p-3 border rounded-lg w-36 border-[#A3D9A5] focus:ring-2 focus:ring-[#81C784]"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
        <button className="bg-[#A3D9A5] text-[#14532D] px-5 py-3 rounded-lg hover:bg-[#81C784] transition">
          Add Goal
        </button>
      </form>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = Math.min((goal.saved / goal.target) * 100, 100).toFixed(0);
          const isUrgent =
            goal.dueDate &&
            (new Date(goal.dueDate) - new Date()) / (1000 * 60 * 60 * 24) <= 7;

          return (
            <div
              key={goal.id}
              className="relative bg-[#F5F9E6] p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between border border-[#A3D9A5]"
            >
              {isUrgent && (
                <div className="absolute top-3 right-3 text-red-400">
                  <FaStar />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-[#14532D]">{goal.name}</h3>
                <p className="text-[#14532D] mt-1 text-sm">
                  ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-[#DFF8B2] h-3 rounded-full">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-[#14532D] text-xs mt-1 flex justify-between">
                  <span>{progress}% completed</span>
                  <span>Due: {goal.dueDate || "N/A"}</span>
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteGoal(goal.id)}
                className="absolute top-3 left-3 text-[#14532D] hover:text-red-500 transition"
              >
                <FaTrash />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
