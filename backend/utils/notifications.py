from sqlalchemy.orm import Session
from backend.models.notification import Notification
from backend.routers.notifications import notify_user
import uuid
from datetime import datetime, timedelta

def create_notification(
    db: Session,
    user_id: int,
    type: str,
    title: str,
    message: str,
    priority: str = "normal",
    data: dict = None,
    expires_at: datetime = None
):
    """Crée une notification et l'envoie en temps réel si l'utilisateur est connecté"""
    try:
        notification = Notification(
            uuid=str(uuid.uuid4()),
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            priority=priority,
            data=data,
            expires_at=expires_at,
            is_read=False
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        # Envoyer en temps réel via WebSocket
        from backend.routers.notifications import NotificationResponse
        notify_user(user_id, NotificationResponse.from_orm(notification).dict())
        
        return notification
    except Exception as e:
        print(f"Erreur lors de la création de la notification: {e}")
        db.rollback()
        return None

# Notifications spécifiques
def notify_project_created(db: Session, user_id: int, project_name: str):
    """Notification lors de la création d'un projet"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="system_update",
        title="Nouveau projet créé",
        message=f"Votre projet '{project_name}' a été créé avec succès.",
        priority="normal",
        data={"action": "view_project"}
    )

def notify_calculation_complete(db: Session, user_id: int, project_name: str, calculation_id: int):
    """Notification lors de la fin d'un calcul"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="calculation_complete",
        title="Calcul terminé",
        message=f"Le calcul pour le projet '{project_name}' est terminé. Consultez les résultats.",
        priority="normal",
        data={"action": "view_calculation", "calculation_id": calculation_id}
    )

def notify_report_ready(db: Session, user_id: int, report_title: str, file_size: int):
    """Notification lors de la génération d'un rapport PDF"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="report_ready",
        title="Rapport PDF prêt",
        message=f"Votre rapport '{report_title}' ({file_size} KB) est prêt au téléchargement.",
        priority="normal",
        data={"action": "download_report"}
    )

def notify_project_archived(db: Session, user_id: int, project_name: str):
    """Notification lors de l'archivage d'un projet"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="system_update",
        title="Projet archivé",
        message=f"Le projet '{project_name}' a été archivé. Vous pouvez le restaurer depuis les archives.",
        priority="low"
    )

def notify_project_restored(db: Session, user_id: int, project_name: str):
    """Notification lors de la restauration d'un projet"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="system_update",
        title="Projet restauré",
        message=f"Le projet '{project_name}' a été restauré depuis les archives.",
        priority="low"
    )

def notify_welcome(db: Session, user_id: int, user_name: str):
    """Notification de bienvenue pour les nouveaux utilisateurs"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="system_update",
        title="Bienvenue sur TelecomDim !",
        message=f"Bonjour {user_name}, bienvenue sur TelecomDim ! Commencez par créer votre premier projet de dimensionnement GSM.",
        priority="normal",
        data={"action": "create_project"}
    )

def notify_error(db: Session, user_id: int, error_message: str):
    """Notification d'erreur système"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="error",
        title="Erreur système",
        message=f"Une erreur s'est produite : {error_message}",
        priority="high"
    )

def notify_system_update(db: Session, user_id: int, title: str, message: str):
    """Notification de mise à jour système"""
    return create_notification(
        db=db,
        user_id=user_id,
        type="system_update",
        title=title,
        message=message,
        priority="normal"
    ) 