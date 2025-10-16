// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Coach from "./pages/Coach";
import Settings from "./pages/Settings";

export default function App() {
  // Keep transactions and cashFlow in local storage so data is dynamic and persists.
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [cashFlow, setCashFlow] = useLocalStorage("cashFlow", []);

  const [lang, setLang] = useLocalStorage("lang", "en");
  const [persona, setPersona] = useLocalStorage("persona", "coach");

  // Transactions helpers
  function addTransaction(tx) {
    // tx must be { id, date, merchant, amount, category }
    const nextId = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    setTransactions([...transactions, { id: nextId, ...tx }]);
  }
  function removeTransaction(id) {
    setTransactions(transactions.filter(t => t.id !== id));
  }
  function updateTransaction(updated) {
    setTransactions(transactions.map(t => (t.id === updated.id ? updated : t)));
  }

  // Cashflow helpers
  function addCashPoint(point) {
    // point: { day, balance, spending, savings }
    setCashFlow([...cashFlow, point]);
  }
  function clearCashFlow() {
    setCashFlow([]);
  }

  function handleDeleteData() {
    // simple utility from Settings page to wipe user data
    setTransactions([]);
    setCashFlow([]);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route
            index
            element={
              <Dashboard
                transactions={transactions}
                addTransaction={addTransaction}
                removeTransaction={removeTransaction}
                updateTransaction={updateTransaction}
                cashFlow={cashFlow}
                addCashPoint={addCashPoint}
                clearCashFlow={clearCashFlow}
                lang={lang}
              />
            }
          />
          <Route
            path="transactions"
            element={
              <Transactions
                transactions={transactions}
                addTransaction={addTransaction}
                removeTransaction={removeTransaction}
                updateTransaction={updateTransaction}
              />
            }
          />
          <Route path="goals" element={<Goals />} />
          <Route
            path="coach"
            element={
              <Coach
                transactions={transactions}
                cashFlow={cashFlow}
                lang={lang}
                persona={persona}
              />
            }
          />
          <Route
            path="settings"
            element={
              <Settings
                lang={lang}
                setLang={setLang}
                persona={persona}
                setPersona={setPersona}
                onDelete={handleDeleteData}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
