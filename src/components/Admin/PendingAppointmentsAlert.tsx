
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Clock, Phone, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface PendingAppointmentsAlertProps {
  appointments: any[];
  onEdit: (appointment: any) => void;
  onConfirmWithPrice: (appointment: any) => void;
}

const PendingAppointmentsAlert: React.FC<PendingAppointmentsAlertProps> = ({ 
  appointments, 
  onEdit, 
  onConfirmWithPrice 
}) => {
  const pendingAppointments = appointments?.filter(apt => apt.status === 'pending') || [];

  if (pendingAppointments.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center text-yellow-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Marcações Pendentes ({pendingAppointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="flex items-start justify-between p-4 bg-white rounded-lg border border-yellow-200 shadow-sm"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {appointment.client_name}
                  </h4>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Pendente
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(parseISO(appointment.appointment_date), 'PPP', { locale: pt })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {appointment.time_slots?.time}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {appointment.client_phone}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Valor: €{appointment.total_price || 0}
                  </div>
                </div>

                {appointment.appointment_services && appointment.appointment_services.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Serviços: </span>
                    {appointment.appointment_services.map((service: any) => service.services?.name).join(', ')}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  size="sm"
                  onClick={() => onConfirmWithPrice(appointment)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirmar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(appointment)}
                >
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingAppointmentsAlert;
