from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    type: str
    title: str
    message: str
    data: Optional[Any] = None
    priority: Optional[str] = "normal"
    expires_at: Optional[datetime] = None

class NotificationResponse(BaseModel):
    id: int
    uuid: str
    user_id: int
    type: str
    title: str
    message: str
    data: Optional[Any] = None
    is_read: bool
    priority: Optional[str] = "normal"
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True 