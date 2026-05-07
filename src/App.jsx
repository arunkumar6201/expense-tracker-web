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

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Expense Tracker
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white text-black rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              Budget
            </h2>

            <h1 className="text-4xl font-bold">
              ₹{totalExpense}
            </h1>

            <p className="text-gray-500 mt-2">
              Total Expenses
            </p>
          </div>

          <div className="bg-white text-black rounded-3xl p-6 shadow-xl md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Expense Distribution
            </h2>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
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

        <div className="bg-white text-black rounded-3xl p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Add Expense
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Expense Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-4 rounded-2xl"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-4 rounded-2xl"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="border p-4 rounded-2xl"
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
                className="border p-4 rounded-2xl"
              />
            )}
          </div>

          <button
            onClick={addExpense}
            className="mt-6 bg-green-600 text-white px-8 py-4 rounded-2xl"
          >
            Add Expense
          </button>
        </div>

        <div className="bg-white text-black rounded-3xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            Recent Expenses
          </h2>

          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-2xl"
              >
                <div>
                  <h3 className="font-bold">
                    {expense.title}
                  </h3>

                  <p className="text-gray-500">
                    {expense.category}
                  </p>
                </div>

                <div className="font-bold text-xl">
                  ₹{expense.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
