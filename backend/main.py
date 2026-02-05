from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal, engine
from models import Expense, Base
from schemas import ExpenseCreate, ExpenseResponse
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/expenses", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    existing = db.query(Expense).filter(
        Expense.idempotency_key == expense.idempotency_key
    ).first()

    if existing:
        return existing

    new_expense = Expense(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date=expense.date,
        idempotency_key=expense.idempotency_key
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@app.get("/expenses", response_model=List[ExpenseResponse])
def list_expenses(
    category: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Expense)

    if category:
        query = query.filter(Expense.category == category)

    if sort == "date_desc":
        query = query.order_by(Expense.date.desc())

    return query.all()
