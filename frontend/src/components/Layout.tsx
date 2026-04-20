import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'SAP Operations', path: '/sap' },
    { name: 'Requests', path: '/requests' },
    { name: 'Config', path: '/config' },
    { name: '服务管理', path: '/service' },
  ];

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* Header */}
      <header className="bg-dark text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">SAP 需求管理系统</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          ${isMenuOpen ? 'block' : 'hidden'} 
          md:block 
          w-64 bg-dark text-white shadow-md
        `}>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`
                      block px-3 py-2 rounded
                      ${location.pathname === item.path ? 'bg-primary' : 'hover:bg-gray-700'}
                      transition-colors
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>SAP 需求管理系统 &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;