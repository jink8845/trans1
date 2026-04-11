from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConfigBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None
    updated_by: str

class ConfigCreate(ConfigBase):
    pass

class ConfigUpdate(BaseModel):
    value: str
    description: Optional[str] = None
    updated_by: str

class ConfigResponse(ConfigBase):
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConfigHistoryBase(BaseModel):
    config_id: int
    old_value: str
    new_value: str
    updated_by: str

class ConfigHistoryCreate(ConfigHistoryBase):
    pass

class ConfigHistoryResponse(ConfigHistoryBase):
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True