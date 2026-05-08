import React, { useEffect, useState } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");

    if (saved) {
      return JSON.parse(saved);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title,
      amount: Number(amount),
      category: category,
    };

    setExpenses([newExpense, ...expenses]);

    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter(
      (expense) => expense.id !== id
    );

    setExpenses(updated);
  };

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: darkMode
          ? "#0f172a"
          : "#f1f5f9",
        color: darkMode ? "white" : "black",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1>Expense Tracker</h1>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
};
