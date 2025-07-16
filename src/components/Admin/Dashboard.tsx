import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboard from './MobileDashboard';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDashboard />;
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
                  <p className="text-sm font-medium">Painel admin funcional</p>
                  <p className="text-xs text-gray-500">Sistema corrigido com sucesso</p>
                </div>
              </div>
              {stats?.pendingAppointments > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {stats.pendingAppointments} marcação{stats.pendingAppointments > 1 ? 'ões' : ''} pendente{stats.pendingAppointments > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">Requer atenção</p>
                  </div>
                </div>
              )}
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
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Marcações</p>
                </div>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-center">
                  <Star className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Serviços</p>
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
