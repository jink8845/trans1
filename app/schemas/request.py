from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RequestBase(BaseModel):
    request_number: str
    type: str
    status: str
    description: Optional[str] = None
    created_by: str

class RequestCreate(RequestBase):
    pass

class RequestUpdate(BaseModel):
    status: Optional[str] = None
    description: Optional[str] = None

class RequestResponse(RequestBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class RequestHistoryBase(BaseModel):
    request_id: int
    status: str
    message: Optional[str] = None

class RequestHistoryCreate(RequestHistoryBase):
    pass

class RequestHistoryResponse(RequestHistoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True