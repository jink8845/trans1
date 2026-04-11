from sqlalchemy.orm import Session
from app.models.request import Request, RequestHistory
from typing import Optional, List, Dict, Any

class RequestRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, request_data: Dict[str, Any]) -> Request:
        """创建新的请求记录"""
        request = Request(**request_data)
        self.db.add(request)
        self.db.commit()
        self.db.refresh(request)
        return request
    
    def get_by_id(self, request_id: int) -> Optional[Request]:
        """根据 ID 获取请求"""
        return self.db.query(Request).filter(Request.id == request_id).first()
    
    def get_by_request_number(self, request_number: str) -> Optional[Request]:
        """根据请求号获取请求"""
        return self.db.query(Request).filter(Request.request_number == request_number).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Request]:
        """获取所有请求"""
        return self.db.query(Request).offset(skip).limit(limit).all()
    
    def update(self, request_id: int, request_data: Dict[str, Any]) -> Optional[Request]:
        """更新请求"""
        request = self.get_by_id(request_id)
        if request:
            for key, value in request_data.items():
                setattr(request, key, value)
            self.db.commit()
            self.db.refresh(request)
        return request
    
    def delete(self, request_id: int) -> bool:
        """删除请求"""
        request = self.get_by_id(request_id)
        if request:
            self.db.delete(request)
            self.db.commit()
            return True
        return False
    
    def create_history(self, history_data: Dict[str, Any]) -> RequestHistory:
        """创建请求历史记录"""
        history = RequestHistory(**history_data)
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history
    
    def get_history_by_request_id(self, request_id: int) -> List[RequestHistory]:
        """获取请求的历史记录"""
        return self.db.query(RequestHistory).filter(RequestHistory.request_id == request_id).all()