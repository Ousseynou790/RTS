from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str]
    network_type: str
    etat: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    network_type: str
    etat: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
