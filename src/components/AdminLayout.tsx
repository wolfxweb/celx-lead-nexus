import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  FileText, 
  Settings, 
  Users, 
  LogOut,
  MessageSquare,
  Smartphone,
  Send,
  History,
  BarChart3,
  Database,
  Shield,
  ChevronDown,
  ChevronRight,
  Home
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Produtos',
      href: '/admin/produtos',
      icon: Package
    },
    {
      title: 'Cursos',
      href: '/admin/cursos',
      icon: BookOpen
    },
    {
      title: 'Blog',
      href: '/admin/blog',
      icon: FileText
    },
    {
      title: 'WhatsApp',
      icon: MessageSquare,
      submenu: [
        {
          title: 'Instâncias',
          href: '/admin/whatsapp/instances',
          icon: Smartphone,
          description: 'Gerenciar instâncias do WhatsApp'
        },
        {
          title: 'Licenças',
          href: '/admin/whatsapp/licenses',
          icon: Shield,
          description: 'Gerenciar planos de licenças'
        },
        {
          title: 'Mensagens',
          href: '/admin/whatsapp/messages',
          icon: Send,
          description: 'Enviar e agendar mensagens'
        },
        {
          title: 'Histórico',
          href: '/admin/whatsapp/history',
          icon: History,
          description: 'Histórico de mensagens'
        },
        {
          title: 'Relatórios',
          href: '/admin/whatsapp/reports',
          icon: BarChart3,
          description: 'Relatórios e estatísticas'
        },
        {
          title: 'Webhooks',
          href: '/admin/whatsapp/webhooks',
          icon: Database,
          description: 'Configurar webhooks'
        },
        {
          title: 'Configurações',
          href: '/admin/whatsapp/settings',
          icon: Settings,
          description: 'Configurações da API'
        }
      ]
    },
    {
      title: 'Usuários',
      href: '/admin/usuarios',
      icon: Users
    },
    {
      title: 'Pop-ups',
      href: '/admin/popups',
      icon: Shield
    }
  ];

  const isActive = (href: string) => location.pathname === href;
  const isSubmenuActive = (href: string) => location.pathname.startsWith(href);

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuTitle) 
        ? prev.filter(item => item !== menuTitle)
        : [...prev, menuTitle]
    );
  };

  const isMenuExpanded = (menuTitle: string) => expandedMenus.includes(menuTitle);

  // Auto-expand menu if current page is in submenu
  React.useEffect(() => {
    const currentMenuItem = menuItems.find(item => 
      item.submenu?.some(subItem => isSubmenuActive(subItem.href))
    );
    
    if (currentMenuItem && !isMenuExpanded(currentMenuItem.title)) {
      setExpandedMenus(prev => [...prev, currentMenuItem.title]);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">CELX Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  // Menu com submenu expansível
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isSubmenuActive(item.submenu[0].href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.title}
                      </div>
                      {isMenuExpanded(item.title) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isMenuExpanded(item.title) && (
                      <div className="ml-8 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              isSubmenuActive(subItem.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3" />
                            <div>
                              <div className="font-medium">{subItem.title}</div>
                              <div className="text-xs text-gray-500">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Menu simples
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start text-gray-600 hover:text-gray-900 mb-2"
            >
              <Link to="/">
                <Home className="w-5 h-5 mr-3" />
                Voltar para o Site
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
      
      {/* Toaster para notificações */}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AdminLayout; 