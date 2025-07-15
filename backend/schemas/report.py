from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    calculation_id: int
    type: str
    title: str
    file_path: Optional[str] = None
    file_size: Optional[int] = None

class ReportResponse(BaseModel):
    id: int
    uuid: str
    calculation_id: int
    user_id: int
    type: str
    title: str
    file_path: Optional[str]
    file_size: Optional[int]
    status: Optional[str]
    download_count: Optional[int]
    expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True 