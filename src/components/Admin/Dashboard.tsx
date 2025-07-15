
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Star, 
  MessageSquare, 
  Image,
  TrendingUp,
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: servicesCount },
        { count: faqsCount },
        { count: mediaCount },
        { count: adminsCount }
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
        supabase.from('media_gallery').select('*', { count: 'exact', head: true }),
        supabase.from('admin_users').select('*', { count: 'exact', head: true })
      ]);

      return {
        services: servicesCount || 0,
        faqs: faqsCount || 0,
        media: mediaCount || 0,
        admins: adminsCount || 0
      };
    }
  });

  const statCards = [
    {
      title: 'Serviços',
      value: stats?.services || 0,
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'FAQs',
      value: stats?.faqs || 0,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Mídia',
      value: stats?.media || 0,
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Administradores',
      value: stats?.admins || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString('pt-PT')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistema inicializado</p>
                  <p className="text-xs text-gray-500">Há poucos minutos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <Star className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Serviços</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">FAQs</p>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
