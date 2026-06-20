from pydantic import BaseModel

class GetRequestRequest(BaseModel):
    system: str
    user: str
    description: str

class GetRequestResponse(BaseModel):
    request_number: str
    status: str

class CreateCopyRequest(BaseModel):
    source_request: str
    target_system: str
    user: str

class CreateCopyResponse(BaseModel):
    copy_request: str
    status: str

class TransportTestRequest(BaseModel):
    request_number: str
    target_system: str
    user: str

class TransportTestResponse(BaseModel):
    transport_status: str
    message: str