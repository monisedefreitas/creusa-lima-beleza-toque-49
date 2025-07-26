
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  MessageSquare,
  Edit,
  Euro,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAppointmentsTableProps {
  appointments: any[];
  onEdit: (appointment: any) => void;
  onWhatsApp: (appointment: any) => void;
  onConfirmWithPrice: (appointment: any) => void;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
}

const MobileAppointmentsTable: React.FC<MobileAppointmentsTableProps> = ({
  appointments,
  onEdit,
  onWhatsApp,
  onConfirmWithPrice,
  onStatusChange
}) => {
  const isMobile = useIsMobile();

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
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  if (!isMobile) {
    return null; // Use desktop table component
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {appointment.clients?.name || appointment.client_name}
                  {appointment.final_price && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      <Euro className="h-3 w-3 mr-1" />
                      Confirmado
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {format(new Date(appointment.appointment_date), 'dd/MM', { locale: pt })}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.time_slots?.time}
                  </span>
                </div>
              </div>
              
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusLabel(appointment.status)}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <a 
                  href={`tel:${appointment.clients?.phone || appointment.client_phone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {appointment.clients?.phone || appointment.client_phone}
                </a>
              </div>
              {(appointment.clients?.email || appointment.client_email) && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <a 
                    href={`mailto:${appointment.clients?.email || appointment.client_email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {appointment.clients?.email || appointment.client_email}
                  </a>
                </div>
              )}
            </div>

            {/* Price Info */}
            <div className="mb-3">
              {appointment.final_price ? (
                <div className="text-sm font-medium text-green-600">
                  Valor Final: €{appointment.final_price}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Valor Estimado: €{appointment.total_price || 0}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Serviços:</p>
              <div className="space-y-1">
                {appointment.appointment_services?.map((service: any) => (
                  <div key={service.id} className="text-sm text-gray-600">
                    • {service.services?.name} (€{service.price})
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <p className="text-sm">
                  <strong>Observações:</strong> {appointment.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {appointment.status === 'pending' && !appointment.final_price && (
                <Button
                  size="sm"
                  onClick={() => onConfirmWithPrice(appointment)}
                  className="bg-green-600 hover:bg-green-700 text-white min-h-[44px] flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirmar
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(appointment)}
                className="min-h-[44px] flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onWhatsApp(appointment)}
                className="text-green-600 hover:text-green-700 min-h-[44px] flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {appointments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              Nenhuma marcação encontrada.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileAppointmentsTable;
