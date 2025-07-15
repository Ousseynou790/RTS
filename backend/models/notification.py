from sqlalchemy import Column, Integer, String, Boolean, Enum, Text, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.sql import func
from backend.database import Base
import enum

class NotificationTypeEnum(str, enum.Enum):
    calculation_complete = "calculation_complete"
    report_ready = "report_ready"
    collaboration_invite = "collaboration_invite"
    system_update = "system_update"
    warning = "warning"
    error = "error"

class NotificationPriorityEnum(str, enum.Enum):
    low = "low"
    normal = "normal"
    high = "high"
    urgent = "urgent"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(NotificationTypeEnum), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    priority = Column(Enum(NotificationPriorityEnum), default="normal")
    expires_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now()) 