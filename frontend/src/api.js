const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchExpenses({ category, sort }) {
  let url = `${API_BASE_URL}/expenses`;
  const params = [];

  if (category) params.push(`category=${category}`);
  if (sort) params.push(`sort=${sort}`);

  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(data) {
  const res = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}
