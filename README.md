# Expense Tracker

A minimal full-stack **Expense Tracker** application that allows users to record, view, filter, and analyze personal expenses.  
The system is designed with **production-like considerations** such as retry safety, correct money handling, and robustness under real-world conditions.

---

## ✨ Features

### Core Functionality
- Add a new expense with:
  - Amount
  - Category
  - Description
  - Date
- View a list of expenses
- Filter expenses by category
- Expenses are sorted by date (newest first)
- View the **total amount** for the currently visible list of expenses

### Real-World Robustness
- Safe against duplicate submissions (e.g. multiple clicks, page refreshes)
- Persistent storage (data survives refresh/restart)
- Basic loading and error states in the UI
- Input validation to prevent invalid data

---

## 🏗️ Tech Stack

### Backend
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic

### Frontend
- React (Vite)
- Plain CSS

---

## 📦 Data Model

Each expense contains:
- id
- amount (stored using a precise numeric type)
- category
- description
- date
- created_at
- idempotency_key

---

## 🔁 Retry & Idempotency Handling

Each expense submission includes an **idempotency key** generated on the client.
If the same request is retried due to network issues or refreshes, the backend
returns the already-created expense instead of creating a duplicate.

This ensures safe retries and correct behavior under real-world conditions.

---

## 🧮 Money Handling

Expense amounts are stored using a numeric/decimal type to avoid floating-point
precision issues.

---

## 🖥️ Running the Project Locally

### Backend
```
cd backend
python -m venv venv
venv\Scripts\Activate
pip install fastapi uvicorn sqlalchemy pydantic
uvicorn main:app --reload
```

Backend URL:
```
http://127.0.0.1:8000
```

API Docs:
```
http://127.0.0.1:8000/docs
```

### Frontend
```
cd frontend
npm install
npm run dev
```

Frontend URL:
```
http://localhost:5173
```

---

## 🧠 Design Decisions

- SQLite was chosen for simplicity and persistence without external dependencies.
- Sorting is applied by default (newest first) to keep the UI simple.
- Category filtering is supported at both API and UI levels.
- UI design is intentionally minimal to focus on correctness and clarity.

---

## ⚖️ Trade-offs

- Automated tests were skipped due to time constraints in favor of correctness
  and robustness.
- Category-wise summaries were intentionally not implemented to keep the
  feature set small.

---

## 🚀 Future Improvements

- Automated tests
- Category-wise summaries
- Pagination
- Authentication and multi-user support

---

## ✅ Assignment Coverage

All core acceptance criteria have been implemented:
- Expense creation
- Expense listing
- Category filtering
- Date sorting (newest first)
- Total calculation for current list
- Retry-safe behavior

---

## 📌 Conclusion

This project prioritizes correctness, simplicity, and production-ready thinking
over feature completeness.
