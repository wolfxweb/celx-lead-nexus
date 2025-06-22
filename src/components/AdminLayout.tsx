import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    {
      name: 'Painel Principal',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Gerenciar Produtos',
      href: '/admin/produtos',
      icon: Package,
      current: location.pathname === '/admin/produtos'
    },
    {
      name: 'Gerenciar Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingCart,
      current: location.pathname === '/admin/pedidos'
    },
    {
      name: 'Gerenciar Usuários',
      href: '/admin/usuarios',
      icon: Users,
      current: location.pathname === '/admin/usuarios'
    },
    {
      name: 'Gerenciar Posts',
      href: '/blog-admin',
      icon: FileText,
      current: location.pathname === '/blog-admin'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-primary">CELX Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 