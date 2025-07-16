
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface AppointmentStatusCardProps {
  appointment: any;
  onStatusUpdate: (appointmentId: string, newStatus: string) => void;
  onWhatsAppClick: (appointment: any) => void;
  onRescheduleClick: (appointment: any) => void;
}

const AppointmentStatusCard: React.FC<AppointmentStatusCardProps> = ({
  appointment,
  onStatusUpdate,
  onWhatsAppClick,
  onRescheduleClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getQuickActions = (status: string) => {
    const actions = [];
    
    if (status === 'pending') {
      actions.push(
        <Button
          key="confirm"
          size="sm"
          onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Confirmar
        </Button>
      );
    }
    
    if (status !== 'cancelled' && status !== 'completed') {
      actions.push(
        <Button
          key="reschedule"
          variant="outline"
          size="sm"
          onClick={() => onRescheduleClick(appointment)}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reagendar
        </Button>
      );
    }
    
    if (status === 'confirmed') {
      actions.push(
        <Button
          key="complete"
          size="sm"
          onClick={() => onStatusUpdate(appointment.id, 'completed')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Concluir
        </Button>
      );
    }

    actions.push(
      <Button
        key="whatsapp"
        variant="outline"
        size="sm"
        onClick={() => onWhatsAppClick(appointment)}
        className="text-green-600 border-green-200 hover:bg-green-50"
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        WhatsApp
      </Button>
    );

    return actions;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">{appointment.client_name}</h3>
          </div>
          <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
            {getStatusIcon(appointment.status)}
            {getStatusLabel(appointment.status)}
          </Badge>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(appointment.appointment_date), 'PPP', { locale: pt })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{appointment.time_slots?.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{appointment.client_phone}</span>
          </div>
          {appointment.client_email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="truncate">{appointment.client_email}</span>
            </div>
          )}
        </div>

        {/* Services */}
        {appointment.appointment_services && appointment.appointment_services.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Serviços:</h4>
            <div className="space-y-2">
              {appointment.appointment_services.map((service: any) => (
                <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{service.services?.name}</span>
                  <span className="text-sm font-medium">€{service.price}</span>
                </div>
              ))}
            </div>
            {appointment.total_price && (
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-lg">€{appointment.total_price}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {appointment.notes && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">Notas:</h4>
            <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">{appointment.notes}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {getQuickActions(appointment.status)}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentStatusCard;
