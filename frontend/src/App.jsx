import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const loadExpenses = async () => {
    try {
      setLoading(true);

      let url = `${API}/expenses?sort=date_desc`;
      if (categoryFilter.trim()) {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setExpenses(data);
      setError("");
    } catch {
      setError("Failed to load expenses");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, [categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
      idempotency_key: crypto.randomUUID(),
    };

    try {
      setLoading(true);
      await fetch(`${API}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setForm({ amount: "", category: "", description: "", date: "" });
      loadExpenses();
    } catch {
      setError("Failed to add expense");
    }

    setLoading(false);
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="container">
      <h2>Expense Tracker</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Amount"
          type="number"
          required
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          placeholder="Category"
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </form>

      {/* ✅ FILTER UI */}
      <div className="filter">
        <input
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>


      {error && <div className="error">{error}</div>}
      {loading && <p>Loading...</p>}

      <div className="total">Total: ₹{total.toFixed(2)}</div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.category}</td>
              <td>{e.description}</td>
              <td>₹{Number(e.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
