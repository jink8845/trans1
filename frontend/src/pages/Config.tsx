import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { configApi } from '../services/api';

interface Config {
  id: number;
  key: string;
  value: string;
  description: string;
  updated_by: string;
  updated_at: string;
}

const Config: React.FC = () => {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await configApi.getConfigs();
      setConfigs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || '获取配置列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: Config) => {
    setEditingConfig(config);
    setNewValue(config.value);
  };

  const handleSave = async () => {
    if (!editingConfig) return;

    try {
      await configApi.updateConfig(editingConfig.id, {
        value: newValue,
        updated_by: 'admin'
      });
      setEditingConfig(null);
      setNewValue('');
      fetchConfigs();
    } catch (err: any) {
      setError(err.response?.data?.detail || '更新配置失败');
    }
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setNewValue('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-dark">配置管理</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">系统配置</h2>

          {loading ? (
            <div className="text-center py-8">
              <p>加载中...</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无配置记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config) => (
                <div key={config.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{config.key}</h3>
                      <p className="text-sm text-gray-500 mt-1">{config.description || '-'}</p>
                    </div>
                    {editingConfig?.id === config.id ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{config.value}</span>
                        <button
                          onClick={() => handleEdit(config)}
                          className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          编辑
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    最后更新: {new Date(config.updated_at).toLocaleString()} by {config.updated_by}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">SAP 连接配置</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SAP 主机</label>
                <input
                  type="text"
                  defaultValue="your-sap-host"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">系统编号</label>
                <input
                  type="text"
                  defaultValue="00"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户端</label>
                <input
                  type="text"
                  defaultValue="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  defaultValue="your-sap-user"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  defaultValue="your-sap-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                注意：SAP 连接配置需要在后端的 .env 文件中修改。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;