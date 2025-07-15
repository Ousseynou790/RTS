from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.notification import Notification
from backend.schemas.notification import NotificationCreate, NotificationResponse
from typing import List, Dict
import json
from backend.auth import get_current_user

router = APIRouter()

# Gestion simple des connexions WebSocket par user_id
active_connections: Dict[int, List[WebSocket]] = {}

def notify_user(user_id: int, notification: dict):
    # Envoie la notification à tous les websockets connectés pour ce user_id
    if user_id in active_connections:
        for ws in active_connections[user_id]:
            try:
                ws.send_text(json.dumps(notification))
            except Exception:
                pass

@router.websocket("/ws/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: int):
    await websocket.accept()
    if user_id not in active_connections:
        active_connections[user_id] = []
    active_connections[user_id].append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Ping/pong ou keepalive
    except WebSocketDisconnect:
        active_connections[user_id].remove(websocket)
        if not active_connections[user_id]:
            del active_connections[user_id]

@router.get("/notifications", response_model=List[NotificationResponse])
def list_notifications(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@router.post("/notifications", response_model=NotificationResponse)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    notif = Notification(**notification.dict())
    db.add(notif)
    db.commit()
    db.refresh(notif)
    # Push temps réel si user connecté en WebSocket
    notify_user(notif.user_id, NotificationResponse.from_orm(notif).dict())
    return notif

@router.put("/notifications/{notif_id}/read", response_model=NotificationResponse)
def mark_as_read(notif_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif 