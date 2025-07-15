# app/routers/projects.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models.project import Project  # Le modèle SQLAlchemy Project
from backend.schemas.project import ProjectCreate, ProjectResponse
from backend.auth import get_current_user  # Le même get_current_user que dans users.py
from backend.utils.notifications import notify_project_created

router = APIRouter()

# ---------------------------------------------
# GET /api/projects - Liste des projets de l'utilisateur
# ---------------------------------------------
@router.get("/projects", response_model=List[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    projects = (
        db.query(Project)
        .filter(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
        .all()
    )
    return projects

# ---------------------------------------------
# GET /api/projects - Liste des projets récents de l'utilisateur
# ---------------------------------------------
@router.get("/recentprojects", response_model=List[ProjectResponse])
def list_recent_projects(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    projects = (
        db.query(Project)
        .filter(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
        .limit(4)
        .all()
    )
    return projects
# ---------------------------------------------
# POST /api/projects - Créer un nouveau projet
# ---------------------------------------------
@router.post("/projects", response_model=ProjectResponse)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = Project(
        name=project_in.name,
        description=project_in.description,
        network_type=project_in.network_type,
        status="active",
        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Créer une notification
    notify_project_created(db, current_user.id, project.name)
    
    return project

# ---------------------------------------------
# GET /api/projects/{project_id} - Lire un projet
# ---------------------------------------------
@router.get("/projects/{project_id}", response_model=ProjectResponse)
def read_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.owner_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    return project

# ---------------------------------------------
# PUT /api/projects/{project_id} - Modifier un projet
# ---------------------------------------------
@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.owner_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    project.name = project_in.name
    project.description = project_in.description
    project.network_type = project_in.network_type
    if hasattr(project_in, "etat") and project_in.etat:
        project.etat = project_in.etat
    db.commit()
    db.refresh(project)
    return project

# ---------------------------------------------
# DELETE /api/projects/{project_id} - Supprimer un projet
# ---------------------------------------------
@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.owner_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    db.delete(project)
    db.commit()
    return {"detail": "Projet supprimé"}
