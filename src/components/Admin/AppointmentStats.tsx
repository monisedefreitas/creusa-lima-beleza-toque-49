
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, Users, Euro, Calculator } from 'lucide-react';

interface AppointmentStatsProps {
  appointments: any[];
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ appointments }) => {
  const stats = React.useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
    
    // Receita confirmada: apenas marcações confirmadas/concluídas com final_price
    const confirmedRevenue = appointments
      .filter(apt => ['confirmed', 'completed'].includes(apt.status) && apt.final_price)
      .reduce((sum, apt) => sum + apt.final_price, 0);
    
    // Receita estimada: marcações pendentes com total_price
    const estimatedRevenue = appointments
      .filter(apt => apt.status === 'pending' && apt.total_price)
      .reduce((sum, apt) => sum + apt.total_price, 0);
    
    // Marcações com valor confirmado
    const withConfirmedPrice = appointments.filter(apt => apt.final_price).length;
    
    const today = new Date();
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate.toDateString() === today.toDateString();
    }).length;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      confirmedRevenue,
      estimatedRevenue,
      withConfirmedPrice,
      todayAppointments
    };
  }, [appointments]);

  const statCards = [
    {
      title: 'Total de Marcações',
      value: stats.total,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Hoje',
      value: stats.todayAppointments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Confirmadas',
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Com Valor Confirmado',
      value: stats.withConfirmedPrice,
      icon: Calculator,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Receita Confirmada',
      value: `€${stats.confirmedRevenue.toFixed(2)}`,
      icon: Euro,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'Valores finais confirmados'
    },
    {
      title: 'Receita Estimada',
      value: `€${stats.estimatedRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Marcações pendentes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.description && (
                  <p className="text-xs text-gray-500">{stat.description}</p>
                )}
              </div>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentStats;
