
import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { 
  useUnreadNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useRealtimeNotifications 
} from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const NotificationSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: unreadNotifications } = useUnreadNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  
  // Enable realtime updates
  useRealtimeNotifications();

  const unreadCount = unreadNotifications?.length || 0;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_appointment':
        return '📅';
      case 'appointment_confirmed':
        return '✅';
      case 'appointment_cancelled':
        return '❌';
      default:
        return '📢';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {unreadNotifications && unreadNotifications.length > 0 ? (
            <div className="divide-y">
              {unreadNotifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: pt })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          )}
        </div>
        
        {unreadCount > 10 && (
          <div className="p-2 border-t text-center">
            <p className="text-xs text-gray-500">
              E mais {unreadCount - 10} notificações...
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSystem;
