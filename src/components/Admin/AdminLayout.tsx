
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  FileImage, 
  MapPin, 
  HelpCircle, 
  Phone, 
  Share2, 
  Clock,
  Home,
  LogOut,
  Menu,
  Megaphone,
  Wrench,
  List,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import NotificationSystem from './NotificationSystem';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast({
        title: "Sessão encerrada",
        description: "Até breve!",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Erro ao encerrar sessão",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { path: '/admin/appointments', icon: Calendar, label: 'Marcações' },
    { path: '/admin/services', icon: List, label: 'Serviços' },
    { path: '/admin/users', icon: Users, label: 'Utilizadores' },
    { path: '/admin/time-slots', icon: Clock, label: 'Horários' },
    { path: '/admin/banners', icon: Megaphone, label: 'Banners' },
    { path: '/admin/media', icon: FileImage, label: 'Galeria' },
    { path: '/admin/addresses', icon: MapPin, label: 'Endereços' },
    { path: '/admin/contacts', icon: Phone, label: 'Contactos' },
    { path: '/admin/social', icon: Share2, label: 'Redes Sociais' },
    { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { path: '/admin/message-templates', icon: MessageSquare, label: 'Templates' },
    { path: '/admin/settings', icon: Wrench, label: 'Configurações' }
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
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path, item.exact)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Ver Site</span>
            </Link>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900">
                Gestão de Conteúdo
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationSystem />
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Admin
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
