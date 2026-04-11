import React, { useState } from 'react';
import Layout from '../components/Layout';
import { sapApi } from '../services/api';

const SAPOperations: React.FC = () => {
  // 获取请求号表单
  const [getRequestForm, setGetRequestForm] = useState({
    system: 'DEV',
    user: '',
    description: ''
  });

  // 创建副本表单
  const [createCopyForm, setCreateCopyForm] = useState({
    source_request: '',
    target_system: 'QAS',
    user: ''
  });

  // 传输测试机表单
  const [transportTestForm, setTransportTestForm] = useState({
    request_number: '',
    target_system: 'PRD',
    user: ''
  });

  // 响应状态
  const [response, setResponse] = useState<{ type: string; message: string; data?: any } | null>(null);
  const [loading, setLoading] = useState(false);

  // 处理获取请求号
  const handleGetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await sapApi.getRequest(getRequestForm);
      setResponse({
        type: 'success',
        message: '获取请求号成功',
        data: res.data
      });
    } catch (error: any) {
      setResponse({
        type: 'error',
        message: error.response?.data?.detail || '获取请求号失败'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理创建副本
  const handleCreateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await sapApi.createCopy(createCopyForm);
      setResponse({
        type: 'success',
        message: '创建副本成功',
        data: res.data
      });
    } catch (error: any) {
      setResponse({
        type: 'error',
        message: error.response?.data?.detail || '创建副本失败'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理传输测试机
  const handleTransportTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await sapApi.transportTest(transportTestForm);
      setResponse({
        type: 'success',
        message: '传输测试机成功',
        data: res.data
      });
    } catch (error: any) {
      setResponse({
        type: 'error',
        message: error.response?.data?.detail || '传输测试机失败'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-dark">SAP 操作</h1>

        {response && (
          <div className={`p-4 rounded mb-6 ${response.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <h3 className="font-medium">{response.type === 'success' ? '操作成功' : '操作失败'}</h3>
            <p>{response.message}</p>
            {response.data && (
              <div className="mt-2 p-2 bg-white rounded">
                <pre className="text-sm">{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 获取请求号 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-4">获取 SAP 开发机请求号</h2>
            <form onSubmit={handleGetRequest}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">系统</label>
                <select
                  value={getRequestForm.system}
                  onChange={(e) => setGetRequestForm({ ...getRequestForm, system: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="DEV">DEV (开发机)</option>
                  <option value="QAS">QAS (测试机)</option>
                  <option value="PRD">PRD (生产机)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">用户</label>
                <input
                  type="text"
                  value={getRequestForm.user}
                  onChange={(e) => setGetRequestForm({ ...getRequestForm, user: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">描述</label>
                <textarea
                  value={getRequestForm.description}
                  onChange={(e) => setGetRequestForm({ ...getRequestForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? '处理中...' : '获取请求号'}
              </button>
            </form>
          </div>

          {/* 创建副本 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-4">创建 SAP 请求副本</h2>
            <form onSubmit={handleCreateCopy}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">源请求号</label>
                <input
                  type="text"
                  value={createCopyForm.source_request}
                  onChange={(e) => setCreateCopyForm({ ...createCopyForm, source_request: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">目标系统</label>
                <select
                  value={createCopyForm.target_system}
                  onChange={(e) => setCreateCopyForm({ ...createCopyForm, target_system: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="QAS">QAS (测试机)</option>
                  <option value="PRD">PRD (生产机)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">用户</label>
                <input
                  type="text"
                  value={createCopyForm.user}
                  onChange={(e) => setCreateCopyForm({ ...createCopyForm, user: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-white py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? '处理中...' : '创建副本'}
              </button>
            </form>
          </div>

          {/* 传输测试机 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-4">传输副本到测试机</h2>
            <form onSubmit={handleTransportTest}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">请求号</label>
                <input
                  type="text"
                  value={transportTestForm.request_number}
                  onChange={(e) => setTransportTestForm({ ...transportTestForm, request_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">目标系统</label>
                <select
                  value={transportTestForm.target_system}
                  onChange={(e) => setTransportTestForm({ ...transportTestForm, target_system: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PRD">PRD (生产机)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">用户</label>
                <input
                  type="text"
                  value={transportTestForm.user}
                  onChange={(e) => setTransportTestForm({ ...transportTestForm, user: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? '处理中...' : '传输到测试机'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SAPOperations;