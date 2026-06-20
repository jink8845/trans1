from fastapi import APIRouter, HTTPException
import subprocess
import psutil
import os
import signal

router = APIRouter()

# 检查服务状态
def check_service_status(port):
    """检查指定端口的服务状态"""
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            cmdline = ' '.join(proc.cmdline())
            # 检查端口是否在命令行中
            if f'port {port}' in cmdline or f'--port {port}' in cmdline or f':{port}' in cmdline:
                return True, proc.pid
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return False, None

# 启动后端服务
@router.post("/start-backend")
async def start_backend_service():
    """启动后端服务"""
    # 检查是否已经在运行
    is_running, _ = check_service_status(8000)
    if is_running:
        raise HTTPException(status_code=400, detail="后端服务已经在运行")
    
    try:
        # 启动后端服务
        subprocess.Popen([
            'python', '-m', 'uvicorn', 'main:app', 
            '--host', '0.0.0.0', 
            '--port', '8000', 
            '--reload'
        ], cwd='/workspace', stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return {"message": "后端服务启动成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"启动后端服务失败: {str(e)}")

# 停止后端服务
@router.post("/stop-backend")
async def stop_backend_service():
    """停止后端服务"""
    # 查找所有后端服务进程
    backend_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            cmdline = ' '.join(proc.cmdline())
            if 'uvicorn' in cmdline and 'main:app' in cmdline:
                backend_processes.append(proc.pid)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    if not backend_processes:
        raise HTTPException(status_code=400, detail="后端服务未运行")
    
    try:
        # 停止所有后端服务进程
        for pid in backend_processes:
            os.kill(pid, signal.SIGTERM)
        return {"message": "后端服务停止成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"停止后端服务失败: {str(e)}")

# 启动前端服务
@router.post("/start-frontend")
async def start_frontend_service():
    """启动前端服务"""
    # 检查是否已经在运行
    is_running, _ = check_service_status(5173)
    if is_running:
        raise HTTPException(status_code=400, detail="前端服务已经在运行")
    
    try:
        # 启动前端服务
        subprocess.Popen([
            'npm', 'run', 'dev', '--', 
            '--host', '0.0.0.0', 
            '--port', '5173'
        ], cwd='/workspace/frontend', stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return {"message": "前端服务启动成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"启动前端服务失败: {str(e)}")

# 停止前端服务
@router.post("/stop-frontend")
async def stop_frontend_service():
    """停止前端服务"""
    # 查找所有前端服务进程
    frontend_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            cmdline = ' '.join(proc.cmdline())
            if 'vite' in cmdline and 'port 5173' in cmdline:
                frontend_processes.append(proc.pid)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    if not frontend_processes:
        raise HTTPException(status_code=400, detail="前端服务未运行")
    
    try:
        # 停止所有前端服务进程
        for pid in frontend_processes:
            os.kill(pid, signal.SIGTERM)
        return {"message": "前端服务停止成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"停止前端服务失败: {str(e)}")

# 获取服务状态
@router.get("/status")
async def get_service_status():
    """获取服务状态"""
    backend_running, _ = check_service_status(8000)
    frontend_running, _ = check_service_status(5173)
    
    return {
        "backend": "running" if backend_running else "stopped",
        "frontend": "running" if frontend_running else "stopped"
    }