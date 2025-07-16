
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Star, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  Clock,
  Euro,
  TrendingUp,
  Plus,
  Eye,
  Settings
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: servicesCount },
        { count: faqsCount },
        { count: adminsCount },
        { count: appointmentsCount },
        { count: pendingAppointmentsCount }
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
        supabase.from('admin_users').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        services: servicesCount || 0,
        faqs: faqsCount || 0,
        admins: adminsCount || 0,
        appointments: appointmentsCount || 0,
        pendingAppointments: pendingAppointmentsCount || 0
      };
    }
  });

  const quickActions = [
    {
      title: 'Nova Marcação',
      icon: Plus,
      action: () => navigate('/admin/create-appointment'),
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Ver Marcações',
      icon: Eye,
      action: () => navigate('/admin/appointments'),
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Gerir Serviços',
      icon: Star,
      action: () => navigate('/admin/services'),
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white'
    },
    {
      title: 'Configurações',
      icon: Settings,
      action: () => navigate('/admin/settings'),
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-white'
    }
  ];

  const statCards = [
    {
      title: 'Marcações Hoje',
      value: stats?.appointments || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pendentes',
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Serviços',
      value: stats?.services || 0,
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'FAQs',
      value: stats?.faqs || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
          Dashboard
        </h1>
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
          Dashboard
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString('pt-PT')}
        </div>
      </div>

      {/* Quick Actions - Mobile Optimized */}
      {isMobile && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} ${action.textColor} min-h-[60px] flex flex-col items-center justify-center space-y-1 p-4`}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-xs text-center font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid - Mobile Optimized */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow touch-manipulation">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
                    {stat.title}
                  </p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-${isMobile ? '5' : '6'} w-${isMobile ? '5' : '6'} ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity - Mobile Optimized */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <TrendingUp className="h-5 w-5 mr-2" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg touch-manipulation">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                  Painel admin otimizado para mobile
                </p>
                <p className="text-xs text-gray-500">Sistema atualizado com sucesso</p>
              </div>
            </div>
            {stats?.pendingAppointments > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg touch-manipulation">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                    {stats.pendingAppointments} marcação{stats.pendingAppointments > 1 ? 'ões' : ''} pendente{stats.pendingAppointments > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">Requer atenção</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Quick Actions */}
      {!isMobile && (
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.slice(0, 2).map((action, index) => (
                <Card 
                  key={index}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={action.action}
                >
                  <div className="text-center">
                    <action.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">{action.title}</p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileDashboard;
