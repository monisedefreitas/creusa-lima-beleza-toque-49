
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
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';

const AppointmentsManager: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { data: appointments, isLoading } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

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

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesSearch = appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.client_phone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesDate = !selectedDate || appointment.appointment_date === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  const todayAppointments = appointments?.filter(apt => 
    apt.appointment_date === format(new Date(), 'yyyy-MM-dd') &&
    ['pending', 'confirmed'].includes(apt.status)
  ) || [];

  const pendingCount = appointments?.filter(apt => apt.status === 'pending').length || 0;
  const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.total_price || 0), 0) || 0;

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
          {pendingCount > 0 && (
            <Badge variant="destructive">
              {pendingCount} pendentes
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
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
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita</p>
                <p className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
              <Label>Data</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
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

                {/* Action Buttons */}
                <div className="ml-4 flex flex-col space-y-2">
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({ 
                          id: appointment.id, 
                          status: 'confirmed' 
                        })}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({ 
                          id: appointment.id, 
                          status: 'cancelled' 
                        })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ 
                        id: appointment.id, 
                        status: 'completed' 
                      })}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Concluir
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

export default AppointmentsManager;
