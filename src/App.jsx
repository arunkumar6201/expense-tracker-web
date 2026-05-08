import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "#f97316" },
  { name: "Transport", icon: "🚗", color: "#3b82f6" },
  { name: "Shopping", icon: "🛍️", color: "#a855f7" },
  { name: "Bills", icon: "⚡", color: "#ef4444" },
  { name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { name: "Other", icon: "📦", color: "#6b7280" },
];

const today = () => new Date().toISOString().split("T")[0];

const fmtAmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
  });

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [insight, setInsight] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    note: "",
    date: today(),
  });

  const fileRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    const theme = localStorage.getItem("darkMode");

    if (saved) {
      setExpenses(JSON.parse(saved));
    }

    if (theme === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addExpense = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (editing) {
      const updated = expenses.map((e) =>
        e.id === editing.id
          ? {
              ...e,
              ...form,
              amount: Number(form.amount),
            }
          : e
      );

      setExpenses(updated);
      setEditing(null);
    } else {
      setExpenses([
        {
          id: Date.now(),
          ...form,
          amount: Number(form.amount),
        },
        ...expenses,
      ]);
    }

    setForm({
      amount: "",
      category: "Food",
      note: "",
      date: today(),
    });

    setShowForm(false);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const editExpense = (exp) => {
    setEditing(exp);
    setForm({
      amount: exp.amount,
      category: exp.category,
      note: exp.note,
      date: exp.date,
    });
    setShowForm(true);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = CATEGORIES.map((c) => ({
    ...c,
    total: expenses
      .filter((e) => e.category === c.name)
      .reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);

  const getInsight = () => {
    if (total === 0) {
      setInsight("No expenses added yet.");
      return;
    }

    const top = categoryTotals.sort((a, b) => b.total - a.total)[0];

    setInsight(
      `You spent the most on ${top.name} (${fmtAmt(
        top.total
      )}). Try reducing unnecessary expenses this week.`
    );
  };

  const fakeUpload = (file) => {
    if (!file) return;

    setExpenses([
      {
        id: Date.now(),
        amount: 250,
        category: "Food",
        note: "Detected from screenshot",
        date: today(),
      },
      ...expenses,
    ]);

    alert("Screenshot scanned successfully");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f3f4f6",
        color: darkMode ? "white" : "black",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>Expense Tracker</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: 30,
            background: "#4f46e5",
            color: "white",
            cursor: "pointer",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: darkMode ? "#1e293b" : "white",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <h2>Total Expenses</h2>
          <h1>{fmtAmt(total)}</h1>
        </div>

        <div
          style={{
            background: darkMode ? "#1e293b" : "white",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <h2>AI Insights</h2>

          <button
            onClick={getInsight}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            Generate Insight
          </button>

          <p>{insight || "Click button for AI insights"}</p>
        </div>
      </div>

      <div
        style={{
          background: darkMode ? "#1e293b" : "white",
          padding: 20,
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Expenses</h2>

          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: 10,
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            + Add Expense
          </button>
        </div>

        {showForm && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              style={inputStyle}
            />

            <input
              placeholder="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={inputStyle}
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              style={inputStyle}
            >
              {CATEGORIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={inputStyle}
            />

            <button
              onClick={addExpense}
              style={{
                padding: 12,
                border: "none",
                borderRadius: 10,
                background: "#16a34a",
                color: "white",
                cursor: "pointer",
              }}
            >
              {editing ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        )}

        <div
          style={{
            marginBottom: 20,
            padding: 20,
            borderRadius: 16,
            border: "2px dashed #94a3b8",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => fileRef.current.click()}
        >
          <h3>📸 Upload Screenshot</h3>
          <p>Auto-detect expenses from payment screenshots</p>

          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => fakeUpload(e.target.files[0])}
          />
        </div>

        {categoryTotals.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2>Category Spending</h2>

            {categoryTotals.map((c) => (
              <div key={c.name} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span>
                    {c.icon} {c.name}
                  </span>
                  <span>{fmtAmt(c.total)}</span>
                </div>

                <div
                  style={{
                    background: darkMode ? "#334155" : "#e5e7eb",
                    height: 10,
                    borderRadius: 20,
                  }}
                >
                  <div
                    style={{
                      width: `${(c.total / total) * 100}%`,
                      background: c.color,
                      height: "100%",
                      borderRadius: 20,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp.id}
              style={{
                background: darkMode ? "#334155" : "#f3f4f6",
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>
                  {CATEGORIES.find((c) => c.name === exp.category)?.icon} {exp.note}
                </h3>

                <p style={{ margin: "5px 0" }}>
                  {exp.category} • {exp.date}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h3 style={{ margin: 0 }}>{fmtAmt(exp.amount)}</h3>

                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => editExpense(exp)}
                    style={{
                      marginRight: 8,
                      border: "none",
                      background: "#2563eb",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    style={{
                      border: "none",
                      background: "#dc2626",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  width: "100%",
  boxSizing: "border-box",
};
