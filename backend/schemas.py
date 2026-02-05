from pydantic import BaseModel, Field
from datetime import date, datetime

class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0)
    category: str
    description: str
    date: date
    idempotency_key: str

class ExpenseResponse(BaseModel):
    id: str
    amount: float
    category: str
    description: str
    date: date
    created_at: datetime   # ✅ FIX HERE

    class Config:
        from_attributes = True  # Pydantic v2
