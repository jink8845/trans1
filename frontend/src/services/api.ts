import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加认证 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      // 清除 token 并跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // 处理 invalid session token 错误
    else if (error.response && error.response.data && error.response.data.error === 'invalid session token') {
      // 清除 token 并跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // 处理其他认证相关错误
    else if (error.message && (error.message.includes('invalid token') || error.message.includes('session'))) {
      // 清除 token 并跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// SAP 相关 API
export const sapApi = {
  getRequest: (data: { system: string; user: string; description: string }) =>
    api.post('/sap/get-request', data),
  createCopy: (data: { source_request: string; target_system: string; user: string }) =>
    api.post('/sap/create-copy', data),
  transportTest: (data: { request_number: string; target_system: string; user: string }) =>
    api.post('/sap/transport-test', data),
};

// 请求管理 API
export const requestApi = {
  getRequests: (skip = 0, limit = 100) =>
    api.get(`/requests?skip=${skip}&limit=${limit}`),
  getRequest: (id: number) =>
    api.get(`/requests/${id}`),
  createRequest: (data: any) =>
    api.post('/requests', data),
  updateRequest: (id: number, data: any) =>
    api.put(`/requests/${id}`, data),
  deleteRequest: (id: number) =>
    api.delete(`/requests/${id}`),
  getRequestHistory: (id: number) =>
    api.get(`/requests/${id}/history`),
};

// 配置管理 API
export const configApi = {
  getConfigs: (skip = 0, limit = 100) =>
    api.get(`/config?skip=${skip}&limit=${limit}`),
  getConfig: (id: number) =>
    api.get(`/config/${id}`),
  getConfigByKey: (key: string) =>
    api.get(`/config/key/${key}`),
  createConfig: (data: any) =>
    api.post('/config', data),
  updateConfig: (id: number, data: any) =>
    api.put(`/config/${id}`, data),
  deleteConfig: (id: number) =>
    api.delete(`/config/${id}`),
  getConfigHistory: (id: number) =>
    api.get(`/config/${id}/history`),
};

// 认证 API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  getCurrentUser: () =>
    api.get('/auth/me'),
  getUsers: (skip = 0, limit = 100) =>
    api.get(`/auth/users?skip=${skip}&limit=${limit}`),
  createUser: (data: any) =>
    api.post('/auth/users', data),
};

// 服务管理 API
export const serviceApi = {
  getStatus: () =>
    api.get('/service/status'),
  startBackend: () =>
    api.post('/service/start-backend'),
  stopBackend: () =>
    api.post('/service/stop-backend'),
  startFrontend: () =>
    api.post('/service/start-frontend'),
  stopFrontend: () =>
    api.post('/service/stop-frontend'),
};

export default api;