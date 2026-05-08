import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  FaUtensils,
  FaCar,
  FaShoppingBag,
  FaBolt,
  FaBriefcase,
  FaMoon,
  FaSun,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

import { motion } from "framer-motion";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");

  const [expenses, setExpenses] = useState([
    {
      title: "Zomato",
      amount: 350,
      category: "Food",
    },
    {
      title: "Uber",
      amount: 220,
      category: "Travel",
    },
    {
      title: "Electricity Bill",
      amount: 1200,
      category: "Bills",
    },
  ]);

  const categoryData = {
    Food: {
      icon: <FaUtensils />,
      color: "#22c55e",
    },
    Travel: {
      icon: <FaCar />,
      color: "#3b82f6",
    },
    Shopping: {
      icon: <FaShoppingBag />,
      color: "#f59e0b",
    },
    Bills: {
      icon: <FaBolt />,
      color: "#ef4444",
    },
    Business: {
      icon: <FaBriefcase />,
      color: "#8b5cf6",
};
