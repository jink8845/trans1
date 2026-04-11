from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.repositories.request_repository import RequestRepository
from app.schemas.request import (
    RequestCreate,
    RequestUpdate,
    RequestResponse,
    RequestHistoryResponse
)
from typing import List

router = APIRouter()

@router.get("", response_model=List[RequestResponse])
async def get_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """获取请求列表"""
    repo = RequestRepository(db)
    requests = repo.get_all(skip=skip, limit=limit)
    return requests

@router.get("/{request_id}", response_model=RequestResponse)
async def get_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """获取单个请求"""
    repo = RequestRepository(db)
    request = repo.get_by_id(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

@router.post("", response_model=RequestResponse)
async def create_request(
    request: RequestCreate,
    db: Session = Depends(get_db)
):
    """创建请求"""
    repo = RequestRepository(db)
    # 检查请求号是否已存在
    existing_request = repo.get_by_request_number(request.request_number)
    if existing_request:
        raise HTTPException(status_code=400, detail="Request number already exists")
    return repo.create(request.model_dump())

@router.put("/{request_id}", response_model=RequestResponse)
async def update_request(
    request_id: int,
    request: RequestUpdate,
    db: Session = Depends(get_db)
):
    """更新请求"""
    repo = RequestRepository(db)
    updated_request = repo.update(request_id, request.model_dump(exclude_unset=True))
    if not updated_request:
        raise HTTPException(status_code=404, detail="Request not found")
    return updated_request

@router.delete("/{request_id}")
async def delete_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """删除请求"""
    repo = RequestRepository(db)
    success = repo.delete(request_id)
    if not success:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": "Request deleted successfully"}

@router.get("/{request_id}/history", response_model=List[RequestHistoryResponse])
async def get_request_history(
    request_id: int,
    db: Session = Depends(get_db)
):
    """获取请求历史"""
    repo = RequestRepository(db)
    # 检查请求是否存在
    request = repo.get_by_id(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    history = repo.get_history_by_request_id(request_id)
    return history