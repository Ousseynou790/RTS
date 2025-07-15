from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from backend.models import calculation
from backend.schemas.calculation import CalculationCreate, CalculationResponse
from backend.database import get_db
from backend.auth import get_current_user
from backend.utils.notifications import notify_calculation_complete

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
    
    # Créer une notification de calcul terminé
    # Récupérer le nom du projet associé
    from backend.models.project import Project
    project = db.query(Project).filter(Project.id == calculation_data.project_id).first()
    project_name = project.name if project else "Projet inconnu"
    
    notify_calculation_complete(db, current_user.id, project_name, new_calc.id)
    
    return new_calc

@router.get("/calculations/latest", response_model=CalculationResponse)
def get_latest_calculation(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    calc = (
        db.query(calculation.Calculation)
        .filter_by(project_id=project_id, user_id=current_user.id)
        .order_by(calculation.Calculation.id.desc())
        .first()
    )
    if not calc:
        raise HTTPException(status_code=404, detail="Aucun calcul trouvé pour ce projet")
    return calc

@router.get("/calculations/{calculation_id}", response_model=CalculationResponse)
def get_calculation(calculation_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    calc = db.query(calculation.Calculation).filter_by(id=calculation_id, user_id=current_user.id).first()
    if not calc:
        raise HTTPException(status_code=404, detail="Calculation not found")
    return calc

@router.get("/calculations", response_model=List[CalculationResponse])
def list_calculations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    calcs = db.query(calculation.Calculation).filter_by(user_id=current_user.id).all()
    return calcs
