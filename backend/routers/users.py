# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Header, Body
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from backend.database import SessionLocal, get_db
from backend.schemas.user import UserCreate, UserResponse, UserLogin, UserUpdate, PasswordChange
from backend.models.user import User
import uuid
import hashlib 
from jose import JWTError, jwt
from fastapi.responses import JSONResponse
from backend.auth import create_access_token, verify_token, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import time
from backend.auth import get_current_user
from pydantic import BaseModel, EmailStr
from backend.utils.notifications import notify_welcome

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")





# Route POST /api/users
@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()

    new_user = User(
        uuid=str(uuid.uuid4()),
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        organization=user.organization,
        role=user.role,
        bio=user.bio,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Créer une notification de bienvenue
    notify_welcome(db, new_user.id, new_user.first_name)
    
    return new_user
# ----------------------------Update user----------------------------
@router.put("/users/me", response_model=UserResponse)
def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # current_user est l'utilisateur authentifié (décodé via le token)
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # Mettre à jour les champs si fournis
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user
# ----------------------------Authentication Route----------------------------
@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    start = time.time()
    user = db.query(User).filter(User.email == credentials.email).first()
    print("Temps de requête DB:", time.time() - start)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    hashed_input_password = hashlib.sha256(credentials.password.encode()).hexdigest()
    if user.password_hash != hashed_input_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials incorrect password"
        )

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
# ----------------------------Users create----------------------------
# Endpoint GET /users/me
@router.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

class PasswordChangeWithEmail(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str

@router.put("/users/change-password")
def change_password(
    passwords: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    import hashlib
    old_password_hash = hashlib.sha256(passwords.old_password.encode()).hexdigest()
    if user.password_hash != old_password_hash:
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")

    new_password_hash = hashlib.sha256(passwords.new_password.encode()).hexdigest()
    user.password_hash = new_password_hash
    db.commit()
    return {"message": "Mot de passe modifié avec succès"}

@router.post("/users/change-password-with-email")
def change_password_with_email(
    data: PasswordChangeWithEmail = Body(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    import hashlib
    old_password_hash = hashlib.sha256(data.old_password.encode()).hexdigest()
    if user.password_hash != old_password_hash:
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    new_password_hash = hashlib.sha256(data.new_password.encode()).hexdigest()
    setattr(user, 'password_hash', new_password_hash)
    db.commit()
    return {"message": "Mot de passe modifié avec succès"}