from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from backend.database import Base
import enum

class ReportTypeEnum(str, enum.Enum):
    pdf_complete = "pdf_complete"
    pdf_statistics = "pdf_statistics"
    excel = "excel"
    json = "json"

class ReportStatusEnum(str, enum.Enum):
    generating = "generating"
    completed = "completed"
    failed = "failed"

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, server_default=func.uuid())
    calculation_id = Column(Integer, ForeignKey("calculations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(ReportTypeEnum), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True)
    status = Column(Enum(ReportStatusEnum), default="generating")
    download_count = Column(Integer, default=0)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now()) 