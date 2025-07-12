from sqlalchemy import Column, Integer, String, Boolean, Text,Enum, TIMESTAMP
from sqlalchemy.sql import func
from backend.database import Base
import enum
from backend.database import engine
from sqlalchemy.orm import relationship

class UserRole(str, enum.Enum):
    student = "student"
    engineer = "engineer"
    researcher = "researcher"
    professor = "professor"
    admin = "admin"
    other = "other"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    organization = Column(String(255))
    role = Column(Enum(UserRole), default="engineer")
    bio = Column(Text)
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login_at = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="user")
User.metadata.create_all(bind=engine)