import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Edit2, 
  Check, 
  X, 
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { Tables } from '@/integrations/supabase/types';

type TimeSlot = {
  id: string;
  time: string;
  duration_minutes: number;
  is_available: boolean;
  max_concurrent: number;
  created_at: string;
  updated_at: string;
};

type AppointmentService = {
  id: string;
  appointment_id: string;
  service_id: string;
  price: number;
  created_at: string;
  services: Tables<'services'>;
};

type Appointment = {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  appointment_date: string;
  time_slot_id: string;
  status: string;
  notes: string | null;
  total_price: number | null;
  created_at: string;
  updated_at: string;
  time_slots: TimeSlot | null;
  appointment_services: AppointmentService[];
};

const AppointmentsManager: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments with related data
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', selectedStatus, selectedDate],
    queryFn: async () => {
      // Use simple query for now since RPC functions may not be working
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(0);

      if (error) {
        console.log('Appointments system not ready yet');
        return []; // Return empty array for now
      }
      
      return []; // Return empty array until database is properly configured
    }
  });

  // Update appointment status - disabled for now
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      throw new Error('Appointment system not configured yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Aviso",
        description: "Sistema de marcações em configuração.",
      });
    },
    onError: () => {
      toast({
        title: "Sistema em Configuração",
        description: "O sistema de marcações está a ser configurado.",
        variant: "destructive",
      });
    }
  });

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

  const filteredAppointments = appointments?.filter(appointment =>
    appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.client_phone.includes(searchTerm)
  ) || [];

  const todayAppointments = appointments?.filter(apt => 
    apt.appointment_date === format(new Date(), 'yyyy-MM-dd') &&
    ['pending', 'confirmed'].includes(apt.status)
  ) || [];

  const pendingCount = appointments?.filter(apt => apt.status === 'pending').length || 0;

  if (isLoading) {
    return <div>Carregando marcações...</div>;
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
                <p className="text-2xl font-bold">
                  €{appointments?.reduce((sum, apt) => sum + (apt.total_price || 0), 0).toFixed(2)}
                </p>
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
                        {appointment.appointment_services?.map((as, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {as.services?.name}
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
                Sistema de marcações em configuração. As marcações aparecerão aqui quando o sistema estiver ativo.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentsManager;