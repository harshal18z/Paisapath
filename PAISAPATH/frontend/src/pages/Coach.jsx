import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Coach() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const scrollRef = useRef(null);

  // Load previous chat
  useEffect(() => {
    const saved = localStorage.getItem("aiCoachMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages and scroll
  useEffect(() => {
    localStorage.setItem("aiCoachMessages", JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch transactions and goals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const txRes = await axios.get("http://localhost:5000/api/wallet/1");
        setTransactions(txRes.data.transactions || []);

        const goalsRes = await axios.get("http://localhost:5000/api/goals/1");
        setGoals(goalsRes.data.goals || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", text: chatInput, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: chatInput,
        userContext: { transactions, goals },
      });

      const aiMessage = { role: "ai", text: res.data.reply, time: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const aiMessage = {
        role: "ai",
        text: "AI Coach is temporarily unavailable. Please try again.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen" style={{ backgroundColor: "#F0F7EC" }}>
      <h1 className="text-3xl font-bold text-[#14532D] mb-6">AI Finance Coach</h1>

      {/* Chat Window */}
      <div className="h-[500px] overflow-y-auto p-4 rounded-xl shadow border border-[#A3D9A5] bg-[#F5F9E6] flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl max-w-[75%] break-words shadow ${
              msg.role === "user"
                ? "self-end bg-blue-200 text-[#0B3D91]"
                : "self-start bg-[#DFF8B2] text-[#14532D]"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <span className="block text-xs text-gray-400 mt-1 text-right">{msg.time}</span>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      {/* Input Area */}
      <div className="flex mt-4 gap-2">
        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your AI Coach..."
          className="flex-1 p-3 rounded-xl border border-[#A3D9A5] resize-none h-16 focus:ring-2 focus:ring-[#81C784]"
        />
        <button
          onClick={sendMessage}
          className="bg-[#A3D9A5] text-[#14532D] px-5 py-3 rounded-xl hover:bg-[#81C784] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
