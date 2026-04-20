import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SAPOperations from './pages/SAPOperations';
import Requests from './pages/Requests';
import Config from './pages/Config';
import ServiceManager from './pages/ServiceManager';

const App: React.FC = () => {
  // 检查是否已登录
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // 保护路由组件
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sap" element={<ProtectedRoute><SAPOperations /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/config" element={<ProtectedRoute><Config /></ProtectedRoute>} />
        <Route path="/service" element={<ProtectedRoute><ServiceManager /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;