# Replace `src/App.jsx` with THIS COMPLETE CODE ONLY

```jsx
import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Moon,
  Sun,
  Plus,
  Upload,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");

  const [expenses, setExpenses] = useState([
    { title: "Zomato", amount: 350, category: "Food" },
    { title: "Uber", amount: 220, category: "Travel" },
    { title: "Netflix", amount: 649, category: "Bills" },
    { title: "Shoes", amount: 2400, category: "Shopping" },
  ]);

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Business",
    "Other",
  ];

  const finalCategory =
    category === "Other" ? customCategory || "Other" : category;

  const addExpense = () => {
    if (!title || !amount) return;

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

  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);

  const pieData = useMemo(() => {
    const grouped = {};

    expenses.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
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
    "#14b8a6",
    "#ec4899",
  ];

  return (
    <div
      className={`${
        darkMode ? "bg-black text-white" : "bg-[#eef2f7] text-black"
      } min-h-screen p-6 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">Expense Tracker</h1>
            <p className="text-gray-500 mt-1">
              Premium Finance Dashboard
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-3 bg-white text-black px-5 py-3 rounded-full shadow-lg"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div
            className={`${
              darkMode ? "bg-zinc-900" : "bg-white"
            } rounded-3xl p-6 shadow-xl`}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
                className="w-20 h-20 rounded-full"
              />

              <div>
                <h2 className="text-2xl font-bold">Good Morning</h2>
                <p className="text-gray-500">Arun Kumar</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Monthly Budget</p>

              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${Math.min(totalExpense / 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between mt-3 text-sm">
                <span>Spent ₹{totalExpense}</span>
                <span>₹50,000 Budget</span>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-zinc-900" : "bg-white"
            } rounded-3xl p-6 shadow-xl`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="text-blue-500" />
              <h2 className="text-2xl font-bold">Budget Overview</h2>
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-5xl font-bold">₹{totalExpense}</h1>
              <p className="text-gray-500 mt-2">Total Expenses</p>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-zinc-900" : "bg-white"
            } rounded-3xl p-6 shadow-xl h-[320px]`}
          >
            <h2 className="text-2xl font-bold mb-4">
              Expense Distribution
            </h2>

            <ResponsiveContainer width="100%" height="100%">
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
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`${
                darkMode ? "bg-zinc-900" : "bg-white"
              } rounded-3xl p-6 shadow-xl`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Plus className="text-green-500" />
                <h2 className="text-2xl font-bold">Add Expense</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Expense Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-4 rounded-2xl border outline-none text-black"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="p-4 rounded-2xl border outline-none text-black"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-4 rounded-2xl border outline-none text-black"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>

                {category === "Other" && (
                  <input
                    type="text"
                    placeholder="Write Custom Category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="p-4 rounded-2xl border outline-none text-black"
                  />
                )}
              </div>

              <div className="flex gap-4 mt-6 flex-wrap">
                <button
                  onClick={addExpense}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  Add Expense
                </button>

                <label className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer flex items-center gap-2">
                  <Upload size={20} />
                  Upload Screenshot
                  <input type="file" hidden />
                </label>
              </div>
            </div>

            <div
              className={`${
                darkMode ? "bg-zinc-900" : "bg-white"
              } rounded-3xl p-6 shadow-xl`}
            >
              <h2 className="text-2xl font-bold mb-6">Recent Expenses</h2>

              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    className={`${
                      darkMode ? "bg-zinc-800" : "bg-gray-100"
                    } rounded-2xl p-4 flex justify-between items-center`}
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {expense.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {expense.category}
                      </p>
                    </div>

                    <div className="text-xl font-bold">
                      ₹{expense.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={`${
                darkMode ? "bg-zinc-900" : "bg-white"
              } rounded-3xl p-6 shadow-xl`}
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-yellow-500" />
                <h2 className="text-2xl font-bold">AI Insights</h2>
              </div>

              <div className="space-y-4 mt-6">
                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-blue-50"
                  } p-4 rounded-2xl`}
                >
                  You are spending more on food this month.
                </div>

                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-green-50"
                  } p-4 rounded-2xl`}
                >
                  Your shopping expenses decreased by 12%.
                </div>

                <div
                  className={`${
                    darkMode ? "bg-zinc-800" : "bg-yellow-50"
                  } p-4 rounded-2xl`}
                >
                  You are within your monthly budget.
                </div>
              </div>
            </div>

            <div
              className={`${
                darkMode ? "bg-zinc-900" : "bg-white"
              } rounded-3xl p-6 shadow-xl`}
            >
              <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-sm">Today</p>
                  <h1 className="text-3xl font-bold">₹1,250</h1>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">This Week</p>
                  <h1 className="text-3xl font-bold">₹8,400</h1>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">This Month</p>
                  <h1 className="text-3xl font-bold">₹{totalExpense}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

# Replace `package.json` with THIS

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
    "lucide-react": "^0.525.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0"
  }
}
```

---

# Replace `vite.config.js` with THIS

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

# Replace `index.html` with THIS

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Expense Tracker</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

# Replace `src/main.jsx` with THIS

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
