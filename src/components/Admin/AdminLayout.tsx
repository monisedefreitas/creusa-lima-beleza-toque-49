
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  Users,
  FileText,
  MessageSquare,
  Image,
  MapPin,
  Star,
  LogOut,
  Menu,
  X,
  Home,
  Palette,
  Phone,
  Instagram,
  Calendar,
  Clock
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard', exact: true },
    { path: '/admin/appointments', icon: Calendar, label: 'Marcações' },
    { path: '/admin/services', icon: Star, label: 'Serviços' },
    { path: '/admin/schedules', icon: Clock, label: 'Horários' },
    { path: '/admin/faqs', icon: MessageSquare, label: 'FAQs' },
    { path: '/admin/contacts', icon: Phone, label: 'Contactos' },
    { path: '/admin/media', icon: Image, label: 'Galeria' },
    { path: '/admin/social', icon: Instagram, label: 'Redes Sociais' },
    { path: '/admin/addresses', icon: MapPin, label: 'Moradas' },
    { path: '/admin/banners', icon: Palette, label: 'Banners' },
    { path: '/admin/settings', icon: Settings, label: 'Configurações' },
    { path: '/admin/users', icon: Users, label: 'Utilizadores' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-darkgreen-900">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path, item.exact) ? "secondary" : "ghost"}
              className="w-full justify-start px-6 py-3 text-left"
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div className="text-sm text-gray-600 mb-2">
            Logado como: {user?.email}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Painel de Administração
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
