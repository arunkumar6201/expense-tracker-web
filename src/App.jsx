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

}
