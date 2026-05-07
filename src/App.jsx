import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");

  const budget = 50000;

  const categories = [
    "All",
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Business",
    "Other",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([newExpense, ...expenses]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const totalSpent = expenses.reduce((acc, item) => acc + item.amount, 0);

  const todaySpent = expenses
    .filter(
      (e) => e.date === new Date().toLocaleDateString()
    )
    .reduce((acc, item) => acc + item.amount, 0);

  const categoryData = categories
    .filter((c) => c !== "All")
    .map((cat) => ({
      name: cat,
      value: expenses
        .filter((e) => e.category === cat)
        .reduce((acc, item) => acc + item.amount, 0),
    }))
    .filter((item) => item.value > 0);

  const aiInsights = useMemo(() => {
    const insights = [];

    if (totalSpent > budget * 0.7) {
      insights.push("⚠️ You already used 70% of your monthly budget.");
    }

    const foodTotal = expenses
      .filter((e) => e.category === "Food")
      .reduce((a, b) => a + b.amount, 0);

    if (foodTotal > 5000) {
      insights.push("🍔 Food spending is higher than usual.");
    }

    if (todaySpent > 2000) {
      insights.push("💸 You spent heavily today.");
    }

    if (expenses.length < 3) {
      insights.push("📊 Add more expenses for smarter AI insights.");
    }

    return insights;
  }, [expenses]);

  const COLORS = [
    "#00C49F",
    "#0088FE",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4560",
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">
              Expense Tracker
            </h1>
            <p className="opacity-70">
              Smart Personal Finance Manager
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-600 p-5 rounded-2xl">
            <p>Total Budget</p>
            <h2 className="text-3xl font-bold">
              ₹{budget.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-red-500 p-5 rounded-2xl">
            <p>Total Spent</p>
            <h2 className="text-3xl font-bold">
              ₹{totalSpent.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-green-600 p-5 rounded-2xl">
            <p>Today</p>
            <h2 className="text-3xl font-bold">
              ₹{todaySpent.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-yellow-500 p-5 rounded-2xl text-black">
            <p>Remaining</p>
            <h2 className="text-3xl font-bold">
              ₹{(budget - totalSpent).toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        {/* Add Expense */}
        <div
          className={`p-5 rounded-2xl mb-6 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Add Expense
          </h2>

          <div className="grid md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-xl text-black"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 rounded-xl text-black"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded-xl text-black"
            >
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
            </select>

            <button
              onClick={addExpense}
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl ${
                filter === cat
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div
            className={`p-5 rounded-2xl ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Expense Breakdown
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`p-5 rounded-2xl ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Category Spending
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div
          className={`p-5 rounded-2xl mb-6 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            AI Smart Insights ✨
          </h2>

          <div className="space-y-2">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-blue-600"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Expense List */}
        <div
          className={`p-5 rounded-2xl ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Recent Expenses
          </h2>

          <div className="space-y-3">
            {filteredExpenses.length === 0 && (
              <p>No expenses added.</p>
            )}

            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className={`flex justify-between items-center p-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-800"
                    : "bg-gray-100"
                }`}
              >
                <div>
                  <h3 className="font-bold">
                    {expense.title}
                  </h3>

                  <p className="opacity-70 text-sm">
                    {expense.category} • {expense.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <h2 className="font-bold text-xl">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </h2>

                  <button
                    onClick={() =>
                      deleteExpense(expense.id)
                    }
                    className="bg-red-500 px-3 py-1 rounded-lg"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
