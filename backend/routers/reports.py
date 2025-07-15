from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.auth import get_current_user
from typing import List
from sqlalchemy import text
from backend.models.report import Report
from backend.schemas.report import ReportCreate, ReportResponse
from backend.utils.notifications import notify_report_ready

router = APIRouter()

@router.get("/reports/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # À adapter selon votre modèle Report
    result = db.execute(text("SELECT file_path FROM reports WHERE id = :id AND user_id = :user_id"), {"id": report_id, "user_id": current_user.id}).fetchone()
    if not result or not result[0]:
        raise HTTPException(status_code=404, detail="Rapport non trouvé")
    return FileResponse(path=result[0], filename="rapport.pdf", media_type="application/pdf")

@router.get("/reports")
def list_reports(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    reports = db.query(Report).filter_by(user_id=current_user.id).all()
    return reports

@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(report_in: ReportCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    report = Report(
        calculation_id=report_in.calculation_id,
        user_id=current_user.id,
        type=report_in.type,
        title=report_in.title,
        file_path=report_in.file_path,
        file_size=report_in.file_size,
        status="completed"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    # Créer une notification de rapport prêt
    notify_report_ready(db, current_user.id, report.title, report.file_size)
    
    return report 