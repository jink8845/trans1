from app.utils.sap_client import sap_client
from app.repositories.request_repository import RequestRepository
from sqlalchemy.orm import Session

class SapService:
    def __init__(self, db: Session):
        self.db = db
        self.request_repo = RequestRepository(db)
    
    def get_request_number(self, system: str, user: str, description: str) -> str:
        """获取 SAP 开发机请求号"""
        # 调用 SAP 客户端获取请求号
        request_number = sap_client.get_request_number(system, user, description)
        
        # 记录请求到数据库
        request_data = {
            "request_number": request_number,
            "type": "development",
            "status": "created",
            "description": description,
            "created_by": user
        }
        self.request_repo.create(request_data)
        
        return request_number
    
    def create_request_copy(self, source_request: str, target_system: str, user: str) -> str:
        """创建 SAP 请求副本"""
        # 调用 SAP 客户端创建副本
        copy_request = sap_client.create_request_copy(source_request, target_system, user)
        
        # 记录副本请求到数据库
        request_data = {
            "request_number": copy_request,
            "type": "copy",
            "status": "created",
            "description": f"Copy of {source_request}",
            "created_by": user
        }
        self.request_repo.create(request_data)
        
        # 更新源请求状态
        source_request_obj = self.request_repo.get_by_request_number(source_request)
        if source_request_obj:
            self.request_repo.update(source_request_obj.id, {"status": "copied"})
        
        return copy_request
    
    def transport_to_test(self, request_number: str, target_system: str, user: str) -> tuple[str, str]:
        """传输副本到测试机"""
        # 调用 SAP 客户端传输请求
        transport_status, message = sap_client.transport_to_test(request_number, target_system, user)
        
        # 更新请求状态
        request_obj = self.request_repo.get_by_request_number(request_number)
        if request_obj:
            self.request_repo.update(request_obj.id, {"status": transport_status})
        
        return transport_status, message