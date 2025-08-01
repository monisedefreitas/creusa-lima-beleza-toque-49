import React, { useState } from 'react';
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
  Star,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileAdminLayout: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications } = useNotifications();
  
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleBackToSite = () => {
    window.open('/', '_blank');
  };

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

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <nav className="py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuItemClick}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors min-h-[44px] ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
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
      </ScrollArea>
      
      <div className="p-4 border-t space-y-2 flex-shrink-0">
        <Button 
          variant="outline" 
          className="w-full min-h-[44px]" 
          onClick={handleBackToSite}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Site
        </Button>
        <Button 
          variant="outline" 
          className="w-full min-h-[44px]" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 flex-shrink-0">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
          
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <SidebarContent />
      </div>

      {/* Desktop Main Content */}
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

export default MobileAdminLayout;
