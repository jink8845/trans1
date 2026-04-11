import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { requestApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await requestApi.getRequests(0, 1000);
        setRequestCount(response.data.length);
      } catch (error) {
        console.error('Failed to fetch request count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestCount();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600 mb-2">总请求数</h3>
            <p className="text-3xl font-bold text-primary">
              {loading ? '加载中...' : requestCount}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600 mb-2">SAP 操作</h3>
            <p className="text-3xl font-bold text-secondary">3</p>
            <p className="text-sm text-gray-500 mt-2">获取请求号、创建副本、传输测试机</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-600 mb-2">系统状态</h3>
            <p className="text-3xl font-bold text-green-500">正常</p>
            <p className="text-sm text-gray-500 mt-2">所有服务运行正常</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-600 mb-4">快速操作</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a 
              href="/sap" 
              className="block bg-primary text-white p-4 rounded hover:bg-blue-600 transition-colors text-center"
            >
              <div className="text-xl font-bold">SAP 操作</div>
              <div className="text-sm">获取请求号、创建副本、传输测试机</div>
            </a>
            
            <a 
              href="/requests" 
              className="block bg-secondary text-white p-4 rounded hover:bg-green-600 transition-colors text-center"
            >
              <div className="text-xl font-bold">请求管理</div>
              <div className="text-sm">查看、编辑、删除请求记录</div>
            </a>
            
            <a 
              href="/config" 
              className="block bg-purple-500 text-white p-4 rounded hover:bg-purple-600 transition-colors text-center"
            >
              <div className="text-xl font-bold">配置管理</div>
              <div className="text-sm">管理系统配置和 SAP 连接</div>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-600 mb-4">系统信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">系统版本</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">技术栈</span>
              <span className="font-medium">FastAPI + React + SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最后更新</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;