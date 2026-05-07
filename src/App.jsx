import React, { useEffect, useState } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Food", "Travel", "Shopping", "Bills", "Business"];

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString("en-IN"),
    };

    setExpenses([newExpense, ...expenses]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((item) => item.category === filter);

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`min-h-screen p-5 ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-5 bg-black text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <p className="text-sm text-gray-300">Free Expense Manager</p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white text-black px-3 py-2 rounded-xl"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-gradient-to-r from-black to-gray-700 text-white rounded-3xl p-5">
            <p className="text-sm text-gray-300">Monthly Budget</p>
            <h2 className="text-3xl font-bold mt-2">₹50,000</h2>
            <p className="mt-3">Spent: {formatINR(total)}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-100 rounded-2xl p-3">
              <p className="text-xs text-gray-500">Today</p>
              <h2 className="font-bold mt-2">{formatINR(total)}</h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-3">
              <p className="text-xs text-gray-500">Week</p>
              <h2 className="font-bold mt-2">{formatINR(total)}</h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-3">
              <p className="text-xs text-gray-500">Month</p>
              <h2 className="font-bold mt-2">{formatINR(total)}</h2>
            </div>
          </div>

          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Expense Title"
              className="w-full border p-3 rounded-2xl"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full border p-3 rounded-2xl"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-3 rounded-2xl"
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Business</option>
            </select>

            <button
              onClick={addExpense}
              className="w-full bg-black text-white py-3 rounded-2xl font-bold"
            >
              Add Expense
            </button>
          </div>

          <div>
            <h2 className="font-bold mb-3">Filter Categories</h2>

            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    filter === cat ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-3">Recent Expenses</h2>

            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-gray-100 p-4 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{expense.title}</h3>
                    <p className="text-sm text-gray-500">
                      {expense.category} • {expense.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{formatINR(expense.amount)}</p>

                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 text-sm mt-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-4">
            <h2 className="font-bold text-lg">Smart Insights ✨</h2>

            <div className="space-y-2 mt-3 text-sm text-gray-700">
              <p>• Your spending increased this week.</p>
              <p>• Food expenses are higher than average.</p>
              <p>• You are close to your monthly budget limit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
