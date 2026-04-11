from sqlalchemy.orm import Session
from app.models.config import Config, ConfigHistory
from typing import Optional, List, Dict, Any

class ConfigRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, config_data: Dict[str, Any]) -> Config:
        """创建新的配置记录"""
        config = Config(**config_data)
        self.db.add(config)
        self.db.commit()
        self.db.refresh(config)
        return config
    
    def get_by_id(self, config_id: int) -> Optional[Config]:
        """根据 ID 获取配置"""
        return self.db.query(Config).filter(Config.id == config_id).first()
    
    def get_by_key(self, key: str) -> Optional[Config]:
        """根据键获取配置"""
        return self.db.query(Config).filter(Config.key == key).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Config]:
        """获取所有配置"""
        return self.db.query(Config).offset(skip).limit(limit).all()
    
    def update(self, config_id: int, config_data: Dict[str, Any]) -> Optional[Config]:
        """更新配置"""
        config = self.get_by_id(config_id)
        if config:
            # 记录历史
            old_value = config.value
            new_value = config_data.get("value", old_value)
            if old_value != new_value:
                history_data = {
                    "config_id": config_id,
                    "old_value": old_value,
                    "new_value": new_value,
                    "updated_by": config_data.get("updated_by", "system")
                }
                self.create_history(history_data)
            
            # 更新配置
            for key, value in config_data.items():
                setattr(config, key, value)
            self.db.commit()
            self.db.refresh(config)
        return config
    
    def delete(self, config_id: int) -> bool:
        """删除配置"""
        config = self.get_by_id(config_id)
        if config:
            self.db.delete(config)
            self.db.commit()
            return True
        return False
    
    def create_history(self, history_data: Dict[str, Any]) -> ConfigHistory:
        """创建配置历史记录"""
        history = ConfigHistory(**history_data)
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history
    
    def get_history_by_config_id(self, config_id: int) -> List[ConfigHistory]:
        """获取配置的历史记录"""
        return self.db.query(ConfigHistory).filter(ConfigHistory.config_id == config_id).all()