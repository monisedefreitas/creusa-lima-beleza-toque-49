import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Check, 
  X, 
  MessageSquare,
  Search,
  Download,
  ExternalLink,
  TrendingUp,
  Users,
  Euro
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useCreateNotification } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import EnhancedWhatsAppManager from './EnhancedWhatsAppManager';

const EnhancedAppointmentsManager: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const { data: appointments, isLoading } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createNotificationMutation = useCreateNotification();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string, notificationTitle: string) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id: appointmentId, 
        status: newStatus 
      });

      const appointment = appointments?.find(apt => apt.id === appointmentId);
      if (appointment) {
        await createNotificationMutation.mutateAsync({
          type: `appointment_${newStatus}`,
          title: notificationTitle,
          message: `Marcação de ${appointment.client_name} foi ${getStatusLabel(newStatus).toLowerCase()}`,
          appointment_id: appointmentId,
          client_name: appointment.client_name
        });
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesSearch = appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.client_phone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesDate = !selectedDate || appointment.appointment_date === selectedDate;
    
    let matchesDateRange = true;
    if (dateRange !== 'all') {
      const appointmentDate = new Date(appointment.appointment_date);
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      switch (dateRange) {
        case 'today':
          matchesDateRange = appointmentDate >= startOfToday && 
                           appointmentDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'week':
          const weekAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = appointmentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDateRange = appointmentDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate && matchesDateRange;
  }) || [];

  const todayAppointments = appointments?.filter(apt => 
    apt.appointment_date === format(new Date(), 'yyyy-MM-dd') &&
    ['pending', 'confirmed'].includes(apt.status)
  ) || [];

  const pendingCount = appointments?.filter(apt => apt.status === 'pending').length || 0;
  const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.total_price || 0), 0) || 0;
  const confirmedToday = todayAppointments.filter(apt => apt.status === 'confirmed').length;
  const completedCount = appointments?.filter(apt => apt.status === 'completed').length || 0;

  const exportToCSV = () => {
    if (!filteredAppointments.length) return;

    const headers = ['Nome', 'Telefone', 'Email', 'Data', 'Hora', 'Serviços', 'Total', 'Estado'];
    const csvData = filteredAppointments.map(appointment => [
      appointment.client_name,
      appointment.client_phone,
      appointment.client_email || '',
      format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt }),
      appointment.time_slots?.time || '',
      appointment.appointment_services?.map(s => s.services?.name).join('; ') || '',
      `€${appointment.total_price || 0}`,
      getStatusLabel(appointment.status)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `marcacoes_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Marcações</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            Hoje: {todayAppointments.length} marcações
          </Badge>
          <Badge variant="outline">
            Confirmadas hoje: {confirmedToday}
          </Badge>
          {pendingCount > 0 && (
            <Badge variant="destructive">
              {pendingCount} pendentes
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="ml-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Enhanced Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{confirmedToday}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-blue-600">{completedCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{appointments?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita</p>
                <p className="text-2xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Nome ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label>Estado</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Período</Label>
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Data específica</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List with Enhanced WhatsApp */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.client_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.time_slots?.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {appointment.client_phone}
                      </div>
                      {appointment.client_email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          {appointment.client_email}
                        </div>
                      )}
                      {appointment.total_price && (
                        <div className="text-sm font-medium">
                          Total: €{appointment.total_price}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Serviços:</p>
                      <div className="space-y-1">
                        {appointment.appointment_services?.map((service) => (
                          <div key={service.id} className="text-sm text-gray-600">
                            • {service.services?.name} (€{service.price})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Observações:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons with new WhatsApp system */}
                <div className="ml-4 flex flex-col space-y-2">
                  {appointment.status === 'pending' && (
                    <>
                      <EnhancedWhatsAppManager appointment={appointment} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(
                          appointment.id, 
                          'cancelled',
                          'Marcação cancelada'
                        )}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  
                  {appointment.status === 'confirmed' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(
                          appointment.id, 
                          'completed',
                          'Marcação concluída'
                        )}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Concluir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const phoneNumber = appointment.client_phone.replace(/\D/g, '');
                          window.open(`https://wa.me/${phoneNumber}`, '_blank');
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </>
                  )}

                  {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const phoneNumber = appointment.client_phone.replace(/\D/g, '');
                        window.open(`https://wa.me/${phoneNumber}`, '_blank');
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                Nenhuma marcação encontrada com os filtros aplicados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedAppointmentsManager;
