import { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");

    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) return;

    setExpenses([
      {
        id: Date.now(),
        title,
        amount: Number(amount),
        category,
      },
      ...expenses,
    ]);

    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const deleteExpense = (id) => {
    setExpenses(
      expenses.filter((e) => e.id !== id)
    );
  };

  const total = expenses.reduce(
    (a, b) => a + b.amount,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: darkMode
          ? "#0f172a"
          : "#f1f5f9",
        color: darkMode ? "white" : "black",
        fontFamily: "Arial",
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
          style={{
            border: "none",
            padding: "12px 20px",
            borderRadius: "30px",
            background: "#4f46e5",
            color: "white",
            cursor: "pointer",
          }}
        >
          {darkMode
            ? "Light Mode"
            : "Dark Mode"}
        </button>
      </div>

      <div
        style={{
          background: darkMode
            ? "#1e293b"
            : "white",
          padding: "25px",
          borderRadius: "20px",
          marginBottom: "25px",
        }}
      >
        <h2>Total Expenses</h2>

        <h1>
          ₹
          {total.toLocaleString("en-IN")}
        </h1>
      </div>

      <div
        style={{
          background: darkMode
            ? "#1e293b"
            : "white",
          padding: "25px",
          borderRadius: "20px",
          marginBottom: "25px",
        }}
      >
        <h2>Add Expense</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            placeholder="Expense Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={inputStyle}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Business</option>
          </select>
        </div>

        <button
          onClick={addExpense}
          style={{
            marginTop: "20px",
            border: "none",
            padding: "14px 24px",
            borderRadius: "12px",
            background: "#16a34a",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Expense
        </button>
      </div>

      <div
        style={{
          background: darkMode
            ? "#1e293b"
            : "white",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2>Recent Expenses</h2>

        {expenses.length === 0 ? (
          <p>No expenses added.</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              style={{
                marginTop: "15px",
                padding: "18px",
                borderRadius: "14px",
                background: darkMode
                  ? "#334155"
                  : "#e2e8f0",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3>{expense.title}</h3>

                <p>{expense.category}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <h3>
                  ₹{expense.amount}
                </h3>

                <button
                  onClick={() =>
                    deleteExpense(
                      expense.id
                    )
                  }
                  style={{
                    border: "none",
                    background: "red",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  width: "100%",
};
