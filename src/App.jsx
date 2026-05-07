# Premium Expense Tracker Upgrade

## Replace `src/App.jsx` with this code

```jsx
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
  const [customCategory, setCustomCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [uploadedImage, setUploadedImage] = useState(null);

  const budget = 50000;

  const categories = [
    "All",
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Business",
    "Health",
    "Entertainment",
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

  const finalCategory =
    category === "Other" && customCategory
      ? customCategory
      : category;

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category: finalCategory,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([newExpense, ...expenses]);

    setTitle("");
    setAmount("");
    setCustomCategory("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const totalSpent = expenses.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const todaySpent = expenses
    .filter(
      (e) =>
        e.date === new Date().toLocaleDateString()
    )
    .reduce((acc, item) => acc + item.amount, 0);

  const categoryData = Object.values(
    expenses.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          name: item.category,
          value: 0,
        };
      }

      acc[item.category].value += item.amount;
      return acc;
    }, {})
  );

  const aiInsights = useMemo(() => {
    const insights = [];

    if (totalSpent > budget * 0.8) {
      insights.push(
        "⚠️ Budget usage crossed 80%."
      );
    }

    if (todaySpent > 3000) {
      insights.push(
        "💸 High spending detected today."
      );
    }

    const foodSpend = expenses
      .filter((e) => e.category === "Food")
      .reduce((a, b) => a + b.amount, 0);

    if (foodSpend > 5000) {
      insights.push(
        "🍔 Food expenses are increasing rapidly."
      );
    }

    if (expenses.length < 5) {
      insights.push(
        "📊 Add more expenses for advanced insights."
      );
    }

    return insights;
  }, [expenses]);

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-[#0B0F19] text-white"
          : "bg-[#F3F4F6] text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold">
              Expense Dashboard
            </h1>
            <p className="opacity-70 mt-1">
              Smart AI Finance Tracker
            </p>
          </div>

          {/* PREMIUM DARK MODE SWITCH */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-44 h-16 rounded-full transition-all duration-500 flex items-center px-2 ${
              darkMode
                ? "bg-black"
                : "bg-white border"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl transition-all duration-500 ${
                darkMode
                  ? "translate-x-0"
                  : "translate-x-28"
              }`}
            >
              {darkMode ? "🌙" : "☀️"}
            </div>

            <span className="absolute text-sm font-bold left-16">
              {darkMode ? "DARK MODE" : "LIGHT MODE"}
            </span>
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-5 rounded-3xl shadow-2xl">
            <p>Total Budget</p>
            <h2 className="text-3xl font-bold mt-2">
              ₹{budget.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-5 rounded-3xl shadow-2xl">
            <p>Total Spent</p>
            <h2 className="text-3xl font-bold mt-2">
              ₹{totalSpent.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-5 rounded-3xl shadow-2xl">
            <p>Today</p>
            <h2 className="text-3xl font-bold mt-2">
              ₹{todaySpent.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-5 rounded-3xl shadow-2xl text-black">
            <p>Remaining</p>
            <h2 className="text-3xl font-bold mt-2">
              ₹{(budget - totalSpent).toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div
          className={`p-5 rounded-3xl mb-6 backdrop-blur-xl shadow-2xl ${
            darkMode
              ? "bg-white/10"
              : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Add Expense
          </h2>

          <div className="grid md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-2xl text-black"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 rounded-2xl text-black"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded-2xl text-black"
            >
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
            </select>

            {category === "Other" && (
              <input
                type="text"
                placeholder="Custom category"
                value={customCategory}
                onChange={(e) =>
                  setCustomCategory(e.target.value)
                }
                className="p-3 rounded-2xl text-black"
              />
            )}

            <button
              onClick={addExpense}
              className="bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl"
            >
              Add Expense
            </button>
          </div>

          {/* SCREENSHOT UPLOAD */}
          <div className="mt-5">
            <label className="block mb-2 font-semibold">
              Upload UPI / Bank Screenshot
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setUploadedImage(
                    URL.createObjectURL(file)
                  );
                }
              }}
              className="w-full"
            />

            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="uploaded"
                className="mt-4 rounded-2xl max-h-72"
              />
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-2xl transition-all ${
                filter === cat
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-white/10"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div
            className={`p-5 rounded-3xl shadow-2xl ${
              darkMode
                ? "bg-white/10"
                : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Expense Distribution
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
            className={`p-5 rounded-3xl shadow-2xl ${
              darkMode
                ? "bg-white/10"
                : "bg-white"
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

        {/* AI INSIGHTS */}
        <div
          className={`p-5 rounded-3xl mb-6 shadow-2xl ${
            darkMode
              ? "bg-white/10"
              : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            AI Smart Insights ✨
          </h2>

          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-blue-600 p-3 rounded-2xl"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* EXPENSE LIST */}
        <div
          className={`p-5 rounded-3xl shadow-2xl ${
            darkMode
              ? "bg-white/10"
              : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Recent Expenses
          </h2>

          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className={`flex justify-between items-center p-4 rounded-2xl ${
                  darkMode
                    ? "bg-black/30"
                    : "bg-gray-100"
                }`}
              >
                <div>
                  <h3 className="font-bold text-lg">
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
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-xl"
                  >
                    Delete
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
```

---

## Replace `package.json` with this

```json
{
  "name": "expense-tracker",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## Keep `index.html` as this

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expense Tracker</title>

  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
  <div id="root"></div>

  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## Final Steps

1. Save all files
2. Commit changes in GitHub
3. Wait for Vercel auto redeploy
4. Open your live website

Your premium dashboard will include:

* Premium minimal UI
* Animated dark/light switch
* Charts
* AI insights
* Custom categories
* Screenshot upload
* Responsive mobile layout
* Modern finance dashboard styling
