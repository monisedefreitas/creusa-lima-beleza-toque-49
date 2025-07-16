import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  MessageSquare,
  Search,
  Plus,
  Edit,
  Filter,
  TrendingUp,
  CheckCircle,
  Euro
} from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useUpdateAppointment } from '@/hooks/useUpdateAppointment';
import { usePriceConfirmation } from '@/hooks/usePriceConfirmation';
import WhatsAppMessageSelector from './WhatsAppMessageSelector';
import AppointmentEditModal from './AppointmentEditModal';
import PriceConfirmationModal from './PriceConfirmationModal';
import WhatsAppConfirmationModal from './WhatsAppConfirmationModal';
import MobileAppointmentsTable from './MobileAppointmentsTable';
import ResponsiveModal from './ResponsiveModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { createWhatsAppLink } from '@/utils/messageTemplates';

const AppointmentsManager: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [whatsappModal, setWhatsappModal] = useState<any>(null);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [priceConfirmationModal, setPriceConfirmationModal] = useState<any>(null);
  const [whatsappConfirmationModal, setWhatsappConfirmationModal] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: appointments, isLoading } = useAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const updateAppointmentMutation = useUpdateAppointment();
  const priceConfirmationMutation = usePriceConfirmation();

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

  const filteredAppointments = appointments?.filter(appointment => {
    const clientName = appointment.clients?.name || appointment.client_name;
    const clientPhone = appointment.clients?.phone || appointment.client_phone;
    
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clientPhone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesDate = !selectedDate || appointment.appointment_date === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  const todayAppointments = appointments?.filter(apt => 
    apt.appointment_date === format(new Date(), 'yyyy-MM-dd') &&
    ['pending', 'confirmed'].includes(apt.status)
  ) || [];

  const pendingCount = appointments?.filter(apt => apt.status === 'pending').length || 0;
  const confirmedCount = appointments?.filter(apt => apt.status === 'confirmed').length || 0;
  
  const confirmedRevenue = appointments?.reduce((sum, apt) => {
    if (['confirmed', 'completed'].includes(apt.status) && apt.final_price) {
      return sum + apt.final_price;
    }
    return sum;
  }, 0) || 0;

  const estimatedRevenue = appointments?.reduce((sum, apt) => {
    if (apt.status === 'pending' && apt.total_price) {
      return sum + apt.total_price;
    }
    return sum;
  }, 0) || 0;

  const handleStatusChange = (appointmentId: string, newStatus: string, nextSession?: string) => {
    updateStatusMutation.mutate({
      id: appointmentId,
      status: newStatus,
      next_session_date: nextSession
    });
  };

  const handleConfirmWithPrice = (appointment: any) => {
    setPriceConfirmationModal(appointment);
  };

  const handlePriceConfirmation = (finalPrice: number, notes?: string) => {
    if (priceConfirmationModal) {
      priceConfirmationMutation.mutate({
        appointmentId: priceConfirmationModal.id,
        finalPrice,
        notes
      });
      setPriceConfirmationModal(null);
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
  };

  const handleUpdateAppointment = (data: any) => {
    updateAppointmentMutation.mutate(
      { id: editingAppointment.id, ...data },
      {
        onSuccess: () => {
          setEditingAppointment(null);
          // Mostrar modal de confirmação de WhatsApp
          setWhatsappConfirmationModal(editingAppointment);
        }
      }
    );
  };

  const handleWhatsApp = (appointment: any) => {
    setWhatsappModal(appointment);
  };

  const handleWhatsAppSend = async (message: string, type: string) => {
    if (!whatsappModal) return;
    
    const variables = {
      clientName: whatsappModal.client_name,
      appointmentDate: new Date(whatsappModal.appointment_date).toLocaleDateString('pt-PT'),
      appointmentTime: whatsappModal.time_slots?.time || '',
      serviceName: whatsappModal.appointment_services?.map((s: any) => s.services?.name).join(', ') || '',
      totalPrice: whatsappModal.total_price?.toString() || '0'
    };

    const whatsappLink = await createWhatsAppLink(
      whatsappModal.client_phone,
      type,
      variables
    );

    // Abrir o link do WhatsApp
    window.open(whatsappLink, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: `WhatsApp aberto com mensagem de ${type} para ${whatsappModal.client_name}`,
    });
    
    setWhatsappModal(null);
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
      <div className={`flex items-center justify-between ${isMobile ? 'flex-col space-y-4' : ''}`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
          {isMobile ? 'Marcações' : 'Gestão de Marcações'}
        </h1>
        <div className={`flex items-center space-x-2 ${isMobile ? 'w-full justify-between' : ''}`}>
          <Button 
            onClick={() => navigate('/admin/create-appointment')}
            className={`${isMobile ? 'flex-1 min-h-[44px]' : ''}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isMobile ? 'Nova' : 'Nova Marcação'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {isMobile ? todayAppointments.length : `Hoje: ${todayAppointments.length} marcações`}
            </Badge>
            {pendingCount > 0 && (
              <Badge variant="destructive">
                {pendingCount} {isMobile ? '' : 'pendentes'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile Optimized */}
      <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-6'} gap-2`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
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
                <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Confirmada</p>
                <p className="text-2xl font-bold text-green-600">€{confirmedRevenue.toFixed(2)}</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Estimada</p>
                <p className="text-2xl font-bold text-orange-600">€{estimatedRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Mobile Optimized */}
      <Card>
        <CardContent className="p-4">
          <div className={`${isMobile ? 'space-y-4' : 'flex flex-wrap gap-4'}`}>
            <div className={`${isMobile ? 'w-full' : 'flex-1 min-w-[250px]'}`}>
              <Label>Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Nome ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-8 ${isMobile ? 'min-h-[44px]' : ''}`}
                />
              </div>
            </div>
            
            <div className={isMobile ? 'grid grid-cols-2 gap-2' : 'flex gap-4'}>
              <div>
                <Label>Estado</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className={`w-${isMobile ? 'full' : '40'} ${isMobile ? 'min-h-[44px]' : ''}`}>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`w-${isMobile ? 'full' : '40'} ${isMobile ? 'min-h-[44px]' : ''}`}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List - Mobile vs Desktop */}
      {isMobile ? (
        <MobileAppointmentsTable
          appointments={filteredAppointments}
          onEdit={handleEditAppointment}
          onWhatsApp={handleWhatsApp}
          onConfirmWithPrice={handleConfirmWithPrice}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            {appointment.clients?.name || appointment.client_name}
                            {appointment.final_price && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Euro className="h-3 w-3 mr-1" />
                                Valor Confirmado
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {format(new Date(appointment.appointment_date), 'PPP', { locale: pt })}
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
                          {appointment.clients?.phone || appointment.client_phone}
                        </div>
                        {(appointment.clients?.email || appointment.client_email) && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            {appointment.clients?.email || appointment.client_email}
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          {appointment.final_price ? (
                            <div className="text-sm font-medium text-green-600">
                              Valor Final: €{appointment.final_price}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Valor Estimado: €{appointment.total_price || 0}
                            </div>
                          )}
                          {appointment.price_confirmed_at && (
                            <div className="text-xs text-gray-500">
                              Confirmado em: {format(new Date(appointment.price_confirmed_at), 'PPp', { locale: pt })}
                            </div>
                          )}
                        </div>
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

                    {appointment.next_session_date && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Próxima Sessão:</strong> {format(new Date(appointment.next_session_date), 'PPP', { locale: pt })}
                        </p>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex items-center space-x-2 pt-2">
                      {appointment.status === 'pending' && !appointment.final_price && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleConfirmWithPrice(appointment)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmar com Valor
                        </Button>
                      )}

                      <Select 
                        value={appointment.status} 
                        onValueChange={(value) => handleStatusChange(appointment.id, value)}
                      >
                        <SelectTrigger className="w-40">
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
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsApp(appointment)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
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
      )}

      {/* Modals - Now Responsive */}
      {priceConfirmationModal && (
        <ResponsiveModal
          isOpen={!!priceConfirmationModal}
          onClose={() => setPriceConfirmationModal(null)}
          title="Confirmar Valor Final"
        >
          <PriceConfirmationModal
            appointment={priceConfirmationModal}
            isOpen={!!priceConfirmationModal}
            onClose={() => setPriceConfirmationModal(null)}
            onConfirm={handlePriceConfirmation}
          />
        </ResponsiveModal>
      )}

      {editingAppointment && (
        <ResponsiveModal
          isOpen={!!editingAppointment}
          onClose={() => setEditingAppointment(null)}
          title="Editar Marcação"
        >
          <AppointmentEditModal
            appointment={editingAppointment}
            isOpen={!!editingAppointment}
            onClose={() => setEditingAppointment(null)}
            onUpdate={handleUpdateAppointment}
          />
        </ResponsiveModal>
      )}

      {whatsappModal && (
        <ResponsiveModal
          isOpen={!!whatsappModal}
          onClose={() => setWhatsappModal(null)}
          title="Enviar WhatsApp"
        >
          <WhatsAppMessageSelector
            isOpen={!!whatsappModal}
            onClose={() => setWhatsappModal(null)}
            appointment={whatsappModal}
            onSend={handleWhatsAppSend}
          />
        </ResponsiveModal>
      )}

      {whatsappConfirmationModal && (
        <WhatsAppConfirmationModal
          isOpen={!!whatsappConfirmationModal}
          onClose={() => setWhatsappConfirmationModal(null)}
          appointment={whatsappConfirmationModal}
        />
      )}
    </div>
  );
};

export default AppointmentsManager;
