from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from backend.models import calculation
from backend.schemas.calculation import CalculationCreate, CalculationResponse
from backend.database import get_db
from backend.auth import get_current_user

router = APIRouter()

@router.post("/calculations", response_model=CalculationResponse)
def create_calculation(
    calculation_data: CalculationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    new_calc = calculation.Calculation(**calculation_data.dict(), user_id=current_user.id)
    db.add(new_calc)
    db.commit()
    db.refresh(new_calc)
    return new_calc
