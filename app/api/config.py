from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.repositories.config_repository import ConfigRepository
from app.schemas.config import (
    ConfigCreate,
    ConfigUpdate,
    ConfigResponse,
    ConfigHistoryResponse
)
from typing import List

router = APIRouter()

@router.get("", response_model=List[ConfigResponse])
async def get_configs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """获取配置列表"""
    repo = ConfigRepository(db)
    configs = repo.get_all(skip=skip, limit=limit)
    return configs

@router.get("/{config_id}", response_model=ConfigResponse)
async def get_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """获取单个配置"""
    repo = ConfigRepository(db)
    config = repo.get_by_id(config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    return config

@router.get("/key/{key}", response_model=ConfigResponse)
async def get_config_by_key(
    key: str,
    db: Session = Depends(get_db)
):
    """根据键获取配置"""
    repo = ConfigRepository(db)
    config = repo.get_by_key(key)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    return config

@router.post("", response_model=ConfigResponse)
async def create_config(
    config: ConfigCreate,
    db: Session = Depends(get_db)
):
    """创建配置"""
    repo = ConfigRepository(db)
    # 检查键是否已存在
    existing_config = repo.get_by_key(config.key)
    if existing_config:
        raise HTTPException(status_code=400, detail="Config key already exists")
    return repo.create(config.model_dump())

@router.put("/{config_id}", response_model=ConfigResponse)
async def update_config(
    config_id: int,
    config: ConfigUpdate,
    db: Session = Depends(get_db)
):
    """更新配置"""
    repo = ConfigRepository(db)
    updated_config = repo.update(config_id, config.model_dump())
    if not updated_config:
        raise HTTPException(status_code=404, detail="Config not found")
    return updated_config

@router.delete("/{config_id}")
async def delete_config(
    config_id: int,
    db: Session = Depends(get_db)
):
    """删除配置"""
    repo = ConfigRepository(db)
    success = repo.delete(config_id)
    if not success:
        raise HTTPException(status_code=404, detail="Config not found")
    return {"message": "Config deleted successfully"}

@router.get("/{config_id}/history", response_model=List[ConfigHistoryResponse])
async def get_config_history(
    config_id: int,
    db: Session = Depends(get_db)
):
    """获取配置历史"""
    repo = ConfigRepository(db)
    # 检查配置是否存在
    config = repo.get_by_id(config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    history = repo.get_history_by_config_id(config_id)
    return history