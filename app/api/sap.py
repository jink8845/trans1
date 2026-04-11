from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.sap_service import SapService
from app.schemas.sap import (
    GetRequestRequest,
    GetRequestResponse,
    CreateCopyRequest,
    CreateCopyResponse,
    TransportTestRequest,
    TransportTestResponse
)

router = APIRouter()

@router.post("/get-request", response_model=GetRequestResponse)
async def get_sap_request(
    request: GetRequestRequest,
    db: Session = Depends(get_db)
):
    """获取 SAP 开发机请求号"""
    try:
        sap_service = SapService(db)
        request_number = sap_service.get_request_number(
            request.system,
            request.user,
            request.description
        )
        return GetRequestResponse(
            request_number=request_number,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-copy", response_model=CreateCopyResponse)
async def create_sap_copy(
    request: CreateCopyRequest,
    db: Session = Depends(get_db)
):
    """创建 SAP 请求副本"""
    try:
        sap_service = SapService(db)
        copy_request = sap_service.create_request_copy(
            request.source_request,
            request.target_system,
            request.user
        )
        return CreateCopyResponse(
            copy_request=copy_request,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transport-test", response_model=TransportTestResponse)
async def transport_to_test(
    request: TransportTestRequest,
    db: Session = Depends(get_db)
):
    """传输副本到测试机"""
    try:
        sap_service = SapService(db)
        transport_status, message = sap_service.transport_to_test(
            request.request_number,
            request.target_system,
            request.user
        )
        return TransportTestResponse(
            transport_status=transport_status,
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))