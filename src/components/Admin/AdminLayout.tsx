
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck,
  Scissors, 
  Settings, 
  LogOut, 
  MessageSquare,
  Globe,
  Clock,
  MapPin,
  Phone,
  HelpCircle,
  FileText,
  Share2,
  ExternalLink,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileAdminLayout from './MobileAdminLayout';

const AdminLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { data: notifications } = useNotifications();
  
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleBackToSite = () => {
    window.open('/', '_blank');
  };

  if (isMobile) {
    return <MobileAdminLayout />;
  }

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { 
      icon: Calendar, 
      label: 'Marcações', 
      path: '/admin/appointments' 
    },
    { 
      icon: UserCheck, 
      label: 'Clientes', 
      path: '/admin/clients' 
    },
    { 
      icon: Scissors, 
      label: 'Serviços', 
      path: '/admin/services' 
    },
    { 
      icon: Clock, 
      label: 'Horários', 
      path: '/admin/timeslots' 
    },
    { 
      icon: Users, 
      label: 'Utilizadores', 
      path: '/admin/users' 
    },
    { 
      icon: FileText, 
      label: 'Conteúdo', 
      path: '/admin/content' 
    },
    { 
      icon: Star, 
      label: 'Depoimentos', 
      path: '/admin/testimonials' 
    },
    { 
      icon: MessageSquare, 
      label: 'WhatsApp', 
      path: '/admin/whatsapp' 
    },
    { 
      icon: HelpCircle, 
      label: 'FAQs', 
      path: '/admin/faqs' 
    },
    { 
      icon: MapPin, 
      label: 'Endereços', 
      path: '/admin/addresses' 
    },
    { 
      icon: Phone, 
      label: 'Contactos', 
      path: '/admin/contacts' 
    },
    { 
      icon: Share2, 
      label: 'Redes Sociais', 
      path: '/admin/social' 
    },
    { 
      icon: Globe, 
      label: 'Site', 
      path: '/admin/site-config' 
    },
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/admin/settings' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleBackToSite}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Site
          </Button>
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
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
