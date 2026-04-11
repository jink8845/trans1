from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate, UserResponse, Token
from app.utils.auth import create_access_token, verify_token
from typing import List

router = APIRouter()
security = HTTPBearer()

# 依赖项：获取当前用户
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    username = verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    repo = UserRepository(db)
    user = repo.get_by_username(username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# 依赖项：检查管理员权限
def get_admin_user(current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    return current_user

from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """用户登录"""
    # 实际环境中，这里应该验证密码
    # 这里为了演示，我们简化处理，只要用户名存在就登录成功
    repo = UserRepository(db)
    user = repo.get_by_username(login_data.username)
    if not user:
        # 如果用户不存在，自动创建一个
        user = repo.create(login_data.username, "user")
    
    # 创建访问令牌
    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")

@router.post("/users", response_model=UserResponse, dependencies=[Depends(get_admin_user)])
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """创建用户（需要管理员权限）"""
    repo = UserRepository(db)
    # 检查用户名是否已存在
    existing_user = repo.get_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return repo.create(user.username, user.role)

@router.get("/users", response_model=List[UserResponse], dependencies=[Depends(get_admin_user)])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取用户列表（需要管理员权限）"""
    repo = UserRepository(db)
    return repo.get_all(skip=skip, limit=limit)

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user