from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    network_type = Column(String, nullable=False)
    status = Column(String, default="En cours")
    etat = Column(String(32), default="En cours")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  
    user = relationship("User", back_populates="project")
    calculations = relationship("Calculation", back_populates="project")