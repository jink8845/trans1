from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional, List

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, username: str, role: str) -> User:
        """创建新用户"""
        user = User(username=username, role=role)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """根据 ID 获取用户"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return self.db.query(User).filter(User.username == username).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """获取所有用户"""
        return self.db.query(User).offset(skip).limit(limit).all()
    
    def delete(self, user_id: int) -> bool:
        """删除用户"""
        user = self.get_by_id(user_id)
        if user:
            self.db.delete(user)
            self.db.commit()
            return True
        return False