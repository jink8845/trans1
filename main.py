from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import sap, requests, config, auth, service
from app.config.database import engine, Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SAP 需求管理系统",
    description="基于 FastAPI + SQLite 的 SAP 需求管理系统",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(sap.router, prefix="/api/sap", tags=["SAP"])
app.include_router(requests.router, prefix="/api/requests", tags=["Requests"])
app.include_router(config.router, prefix="/api/config", tags=["Config"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(service.router, prefix="/api/service", tags=["Service"])

@app.get("/")
async def root():
    return {"message": "SAP 需求管理系统 API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}