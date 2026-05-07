import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");

  const [expenses, setExpenses] = useState([
    { title: "Zomato", amount: 350, category: "Food" },
    { title: "Uber", amount: 220, category: "Travel" },
  ]);

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Business",
    "Other",
  ];

  const addExpense = () => {
    if (!title || !amount) return;

    const finalCategory =
      category === "Other"
        ? customCategory || "Other"
        : category;

    setExpenses([
      ...expenses,
      {
        title,
        amount: Number(amount),
        category: finalCategory,
      },
    ]);

    setTitle("");
    setAmount("");
    setCustomCategory("");
  };

  const deleteExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
  };

  const totalExpense = expenses.reduce(
    (a, b) => a + b.amount,
    0
  );

  const pieData = useMemo(() => {
    const grouped = {};

    expenses.forEach((e) => {
      grouped[e.category] =
        (grouped[e.category] || 0) + e.amount;
    });

    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
  }, [expenses]);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  const foodExpense = expenses
    .filter((e) => e.category === "Food")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode
          ? "bg-[#0f172a] text-white"
          : "bg-[#eef2f7] text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-5xl font-bold">
              Expense Tracker
            </h1>

            <p className="text-gray-500 mt-2">
              Premium Finance Dashboard
            </p>
          </div>

          {/* PREMIUM SWITCH */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-32 h-16 rounded-full flex items-center px-2 transition-all duration-300 ${
              darkMode
                ? "bg-black"
                : "bg-white shadow-lg"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold transition-all duration-300 ${
                darkMode
                  ? "translate-x-16"
                  : "translate-x-0"
              }`}
            >
              {darkMode ? "🌙" : "☀️"}
            </div>
          </button>
        </div>

        {/* TOP */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* BUDGET */}
          <div
            className={`rounded-3xl p-6 shadow-xl ${
              darkMode
                ? "bg-[#1e293b]"
                : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">
              Budget
            </h2>

            <h1 className="text-5xl font-bold">
              ₹{totalExpense}
            </h1>

            <p className="text-gray-400 mt-3">
              Total Expenses
            </p>

            <div className="mt-8">
              <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{
                    width: `${Math.min(
                      totalExpense / 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* CHART */}
          <div
            className={`rounded-3xl p-6 shadow-xl lg:col-span-2 ${
              darkMode
                ? "bg-[#1e293b]"
                : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">
              Expense Distribution
            </h2>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div
          className={`rounded-3xl p-6 shadow-xl mb-8 ${
            darkMode
              ? "bg-[#1e293b]"
              : "bg-white"
          }`}
        >
          <h2 className="text-3xl font-bold mb-8">
            Add Expense
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              placeholder="Expense Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="border p-5 rounded-2xl text-black"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="border p-5 rounded-2xl text-black"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="border p-5 rounded-2xl text-black"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            {category === "Other" && (
              <input
                type="text"
                placeholder="Custom Category"
                value={customCategory}
                onChange={(e) =>
                  setCustomCategory(e.target.value)
                }
                className="border p-5 rounded-2xl text-black"
              />
            )}
          </div>

          <div className="flex gap-4 mt-6 flex-wrap">

            <button
              onClick={addExpense}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold"
            >
              Add Expense
            </button>

            {/* SCREENSHOT */}
            <label className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl cursor-pointer font-semibold">
              Upload Screenshot
              <input type="file" hidden />
            </label>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* EXPENSES */}
          <div className="lg:col-span-2">

            <div
              className={`rounded-3xl p-6 shadow-xl ${
                darkMode
                  ? "bg-[#1e293b]"
                  : "bg-white"
              }`}
            >
              <h2 className="text-3xl font-bold mb-8">
                Recent Expenses
              </h2>

              <div className="space-y-5">

                {expenses.map((expense, index) => (

                  <div
                    key={index}
                    className={`p-5 rounded-2xl flex justify-between items-center ${
                      darkMode
                        ? "bg-[#0f172a]"
                        : "bg-gray-100"
                    }`}
                  >
                    <div>
                      <h3 className="text-xl font-bold">
                        {expense.title}
                      </h3>

                      <p className="text-gray-400">
                        {expense.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <div className="text-2xl font-bold">
                        ₹{expense.amount}
                      </div>

                      <button
                        onClick={() =>
                          deleteExpense(index)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI */}
          <div>

            <div
              className={`rounded-3xl p-6 shadow-xl ${
                darkMode
                  ? "bg-[#1e293b]"
                  : "bg-white"
              }`}
            >
              <h2 className="text-3xl font-bold mb-8">
                AI Analysis
              </h2>

              <div className="space-y-5">

                <div
                  className={`p-5 rounded-2xl ${
                    darkMode
                      ? "bg-[#0f172a]"
                      : "bg-blue-50"
                  }`}
                >
                  Food expenses this month:
                  <br />
                  <span className="text-2xl font-bold">
                    ₹{foodExpense}
                  </span>
                </div>

                <div
                  className={`p-5 rounded-2xl ${
                    darkMode
                      ? "bg-[#0f172a]"
                      : "bg-green-50"
                  }`}
                >
                  Total monthly spending:
                  <br />
                  <span className="text-2xl font-bold">
                    ₹{totalExpense}
                  </span>
                </div>

                <div
                  className={`p-5 rounded-2xl ${
                    darkMode
                      ? "bg-[#0f172a]"
                      : "bg-yellow-50"
                  }`}
                >
                  You are managing your expenses well.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
