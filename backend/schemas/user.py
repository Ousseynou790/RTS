# app/schemas/user.py
from typing import Optional
from enum import Enum
from pydantic import BaseModel, EmailStr

class UserRole(str, Enum):
    student = "student"
    engineer = "engineer"
    researcher = "researcher"
    professor = "professor"
    admin = "admin"
    other = "other"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[UserRole] = UserRole.engineer
    bio: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    organization: Optional[str]
    role: Optional[UserRole]
    bio: Optional[str]

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    is_active: bool
    phone : str
    bio : str
    organization:str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOutput(BaseModel):
    id: int
    uuid: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    role: UserRole
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool

    class Config:
        orm_mode = True

