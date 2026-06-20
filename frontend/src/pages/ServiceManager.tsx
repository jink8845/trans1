import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '../services/api';

const ServiceManager: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'running' | 'stopped'>('unknown');
  const [frontendStatus, setFrontendStatus] = useState<'unknown' | 'running' | 'stopped'>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const navigate = useNavigate();

  // 检查服务状态
  const checkServiceStatus = async () => {
    try {
      const response = await serviceApi.getStatus();
      setBackendStatus(response.data.backend as 'running' | 'stopped');
      setFrontendStatus(response.data.frontend as 'running' | 'stopped');
    } catch (error) {
      console.error('获取服务状态失败:', error);
      // 失败时回退到原始检查方法
      try {
        // 检查后端服务
        const backendResponse = await fetch('http://localhost:8000/health');
        if (backendResponse.ok) {
          setBackendStatus('running');
        } else {
          setBackendStatus('stopped');
        }
      } catch {
        setBackendStatus('stopped');
      }

      try {
        // 检查前端服务
        const frontendResponse = await fetch('http://localhost:5173');
        if (frontendResponse.ok) {
          setFrontendStatus('running');
        } else {
          setFrontendStatus('stopped');
        }
      } catch {
        setFrontendStatus('stopped');
      }
    }
  };

  // 启动后端服务
  const startBackendService = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    setCurrentAction('启动后端服务');
    setError('');
    setMessage('正在启动后端服务...');
    setProgress(0);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(30);
      setMessage('调用后端 API...');
      
      await serviceApi.startBackend();
      setProgress(60);
      setMessage('等待服务启动...');
      
      // 等待服务启动
      await new Promise(resolve => setTimeout(resolve, 3000));
      setProgress(80);
      setMessage('检查服务状态...');
      
      // 重新检查状态
      await checkServiceStatus();
      setProgress(100);
      setMessage('后端服务启动成功！');
      
      // 保持成功消息显示一段时间
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err: any) {
      setError(err.response?.data?.detail || '启动后端服务失败');
      setMessage('');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setCurrentAction('');
      setProgress(0);
    }
  };

  // 停止后端服务
  const stopBackendService = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    setCurrentAction('停止后端服务');
    setError('');
    setMessage('正在停止后端服务...');
    setProgress(0);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(30);
      setMessage('调用后端 API...');
      
      await serviceApi.stopBackend();
      setProgress(60);
      setMessage('等待服务停止...');
      
      // 等待服务停止
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(80);
      setMessage('检查服务状态...');
      
      // 重新检查状态
      await checkServiceStatus();
      setProgress(100);
      setMessage('后端服务停止成功！');
      
      // 保持成功消息显示一段时间
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err: any) {
      setError(err.response?.data?.detail || '停止后端服务失败');
      setMessage('');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setCurrentAction('');
      setProgress(0);
    }
  };

  // 启动前端服务
  const startFrontendService = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    setCurrentAction('启动前端服务');
    setError('');
    setMessage('正在启动前端服务...');
    setProgress(0);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(30);
      setMessage('调用后端 API...');
      
      await serviceApi.startFrontend();
      setProgress(60);
      setMessage('等待服务启动...');
      
      // 等待服务启动
      await new Promise(resolve => setTimeout(resolve, 3000));
      setProgress(80);
      setMessage('检查服务状态...');
      
      // 重新检查状态
      await checkServiceStatus();
      setProgress(100);
      setMessage('前端服务启动成功！');
      
      // 保持成功消息显示一段时间
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err: any) {
      setError(err.response?.data?.detail || '启动前端服务失败');
      setMessage('');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setCurrentAction('');
      setProgress(0);
    }
  };

  // 停止前端服务
  const stopFrontendService = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    setCurrentAction('停止前端服务');
    setError('');
    setMessage('正在停止前端服务...');
    setProgress(0);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(30);
      setMessage('调用后端 API...');
      
      await serviceApi.stopFrontend();
      setProgress(60);
      setMessage('等待服务停止...');
      
      // 等待服务停止
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(80);
      setMessage('检查服务状态...');
      
      // 重新检查状态
      await checkServiceStatus();
      setProgress(100);
      setMessage('前端服务停止成功！');
      
      // 保持成功消息显示一段时间
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err: any) {
      setError(err.response?.data?.detail || '停止前端服务失败');
      setMessage('');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setCurrentAction('');
      setProgress(0);
    }
  };

  // 打开项目
  const openProject = () => {
    if (backendStatus === 'running' && frontendStatus === 'running') {
      navigate('/dashboard');
    } else {
      setError('请先启动所有服务');
    }
  };

  // 初始化时检查服务状态
  useEffect(() => {
    checkServiceStatus();
    // 每5秒检查一次服务状态
    const interval = setInterval(checkServiceStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // 状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">服务管理</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="mb-2">
              <h3 className="font-medium text-blue-800">{currentAction}</h3>
            </div>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <p className="text-blue-700">{message}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">服务状态</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 后端服务状态 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">后端服务 (FastAPI)</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(backendStatus)}`}>
                {backendStatus === 'running' ? '运行中' : backendStatus === 'stopped' ? '已停止' : '未知'}
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={startBackendService}
                  disabled={backendStatus === 'running' || isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  启动
                </button>
                <button
                  onClick={stopBackendService}
                  disabled={backendStatus === 'stopped' || isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  停止
                </button>
              </div>
            </div>

            {/* 前端服务状态 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">前端服务 (React)</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(frontendStatus)}`}>
                {frontendStatus === 'running' ? '运行中' : frontendStatus === 'stopped' ? '已停止' : '未知'}
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={startFrontendService}
                  disabled={frontendStatus === 'running' || isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  启动
                </button>
                <button
                  onClick={stopFrontendService}
                  disabled={frontendStatus === 'stopped' || isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  停止
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">项目管理</h2>
          <button
            onClick={openProject}
            disabled={backendStatus !== 'running' || frontendStatus !== 'running'}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
          >
            打开项目
          </button>
          <p className="mt-4 text-sm text-gray-600">
            点击按钮将跳转到项目主界面
          </p>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">服务信息</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>后端服务地址: http://localhost:8000</li>
            <li>前端服务地址: http://localhost:5173</li>
            <li>API 文档: http://localhost:8000/docs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;