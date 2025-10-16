// Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#F0F7EC] shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-[#3E7C59]">
        Welcome back 👋
      </h2>
      <button
        onClick={() => navigate("/transactions")}
        className="bg-[#A8D5BA] text-[#3E7C59] px-4 py-2 rounded-xl hover:bg-[#8FCFA0] transition"
      >
        + Add Transaction
      </button>
    </header>
  );
}

