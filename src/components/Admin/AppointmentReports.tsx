
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, CheckCircle, Euro, Clock } from 'lucide-react';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface AppointmentReportsProps {
  appointments: any[];
}

const AppointmentReports: React.FC<AppointmentReportsProps> = ({ appointments }) => {
  const [periodFilter, setPeriodFilter] = useState('30');

  const getDateRange = (days: string) => {
    const end = new Date();
    const start = days === 'all' ? new Date(2020, 0, 1) : subDays(end, parseInt(days));
    return { start, end };
  };

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    
    const { start, end } = getDateRange(periodFilter);
    
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.appointment_date);
      return isWithinInterval(appointmentDate, { start, end });
    });
  }, [appointments, periodFilter]);

  const stats = useMemo(() => {
    const completed = filteredAppointments.filter(apt => apt.status === 'completed');
    const confirmed = filteredAppointments.filter(apt => apt.status === 'confirmed');
    const cancelled = filteredAppointments.filter(apt => apt.status === 'cancelled');
    
    const totalRevenue = completed.reduce((sum, apt) => sum + (apt.final_price || apt.total_price || 0), 0);
    const confirmedRevenue = confirmed.reduce((sum, apt) => sum + (apt.final_price || apt.total_price || 0), 0);
    
    return {
      completed: completed.length,
      confirmed: confirmed.length,
      cancelled: cancelled.length,
      totalRevenue,
      confirmedRevenue,
      total: filteredAppointments.length
    };
  }, [filteredAppointments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Relatório de Marcações</h3>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
            <SelectItem value="all">Todos os períodos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita</p>
                <p className="text-2xl font-bold text-purple-600">€{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <Euro className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completed Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Marcações Concluídas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAppointments
              .filter(apt => apt.status === 'completed')
              .slice(0, 5)
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.client_name}</p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(appointment.appointment_date), 'PPP', { locale: pt })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Concluída
                    </Badge>
                    <p className="text-sm font-medium text-green-600 mt-1">
                      €{appointment.final_price || appointment.total_price || 0}
                    </p>
                  </div>
                </div>
              ))}
            {filteredAppointments.filter(apt => apt.status === 'completed').length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhuma marcação concluída no período selecionado.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentReports;
