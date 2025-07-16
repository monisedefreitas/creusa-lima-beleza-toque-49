
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useCreateNotification } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import EnhancedWhatsAppManager from './EnhancedWhatsAppManager';
import RescheduleModal from './RescheduleModal';

const EnhancedAppointmentsManager: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const { data: appointments, isLoading } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createNotificationMutation = useCreateNotification();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const filteredAppointments = appointments?.filter(appointment => 
    statusFilter === 'all' || appointment.status === statusFilter
  ) || [];

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: appointmentId, status: newStatus });
      
      await createNotificationMutation.mutateAsync({
        type: 'status_updated',
        title: 'Estado da Marcação Atualizado',
        message: `Estado alterado para: ${getStatusLabel(newStatus)}`,
        appointment_id: appointmentId
      });

      toast({
        title: "Estado atualizado",
        description: `Marcação marcada como ${getStatusLabel(newStatus).toLowerCase()}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar estado da marcação",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowWhatsApp(true);
  };

  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReschedule(true);
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Marcações</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmadas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-gray-500">Nenhuma marcação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {appointment.client_name}
                  </CardTitle>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(appointment.appointment_date), 'PPP', { locale: pt })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{appointment.time_slots?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{appointment.client_phone}</span>
                  </div>
                  {appointment.client_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{appointment.client_email}</span>
                    </div>
                  )}
                </div>

                {appointment.appointment_services && appointment.appointment_services.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Serviços:</h4>
                    <div className="space-y-1">
                      {appointment.appointment_services.map((service: any) => (
                        <div key={service.id} className="flex justify-between items-center text-sm">
                          <span>{service.services?.name}</span>
                          <span className="font-medium">€{service.price}</span>
                        </div>
                      ))}
                    </div>
                    {appointment.total_price && (
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total:</span>
                          <span>€{appointment.total_price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {appointment.notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Notas:</h4>
                    <p className="text-gray-600 text-sm">{appointment.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={appointment.status}
                    onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWhatsAppClick(appointment)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRescheduleClick(appointment)}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reagendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showWhatsApp && selectedAppointment && (
        <EnhancedWhatsAppManager
          appointment={selectedAppointment}
          isOpen={showWhatsApp}
          onClose={() => {
            setShowWhatsApp(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {showReschedule && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          isOpen={showReschedule}
          onClose={() => {
            setShowReschedule(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedAppointmentsManager;
