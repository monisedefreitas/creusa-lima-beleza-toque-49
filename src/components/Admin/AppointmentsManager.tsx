
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Check, 
  X, 
  MessageSquare,
  Search,
  Plus,
  Edit
} from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useAppointments, useUpdateAppointmentStatus, useCreateAppointment, useTimeSlots, useBusinessHours, useBookedSlotsForDate } from '@/hooks/useAppointments';
import { useClients } from '@/hooks/useClients';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import WhatsAppMessageSelector from './WhatsAppMessageSelector';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AppointmentsManager: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    appointment_date: '',
    time_slot_id: '',
    service_ids: [] as string[],
    notes: '',
    next_session_date: ''
  });
  const [selectedDateForForm, setSelectedDateForForm] = useState<Date>();

  const { data: appointments, isLoading } = useAppointments();
  const { data: clients } = useClients();
  const { data: timeSlots } = useTimeSlots();
  const { data: businessHours } = useBusinessHours();
  const { data: bookedSlots } = useBookedSlotsForDate(selectedDateForForm ? format(selectedDateForForm, 'yyyy-MM-dd') : '');
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createAppointmentMutation = useCreateAppointment();

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
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
  const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.total_price || 0), 0) || 0;

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    const isBusinessDay = businessHours?.some(bh => bh.day_of_week === dayOfWeek);
    const isNotPast = !isBefore(date, startOfDay(new Date()));
    return isBusinessDay && isNotPast;
  };

  const getAvailableTimeSlots = () => {
    if (!timeSlots || !bookedSlots) return [];
    return timeSlots.filter(slot => !bookedSlots.includes(slot.id));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId) 
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId]
    }));
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
      ...formData,
      appointment_date: selectedDateForForm ? format(selectedDateForForm, 'yyyy-MM-dd') : formData.appointment_date
    };

    createAppointmentMutation.mutate(appointmentData, {
      onSuccess: () => {
        setShowCreateForm(false);
        setFormData({
          client_id: '',
          client_name: '',
          client_phone: '',
          client_email: '',
          appointment_date: '',
          time_slot_id: '',
          service_ids: [],
          notes: '',
          next_session_date: ''
        });
        setSelectedDateForForm(undefined);
      }
    });
  };

  const handleStatusChange = (appointmentId: string, newStatus: string, nextSession?: string) => {
    updateStatusMutation.mutate({
      id: appointmentId,
      status: newStatus,
      next_session_date: nextSession
    });
  };

  const handleWhatsApp = (appointment: any) => {
    setWhatsappModal(appointment);
  };

  const handleWhatsAppSend = (message: string, type: string) => {
    // Here you would typically integrate with a WhatsApp API
    // For now, we'll just show a success message
    console.log('Sending WhatsApp message:', { message, type, appointment: whatsappModal });
    
    toast({
      title: "Mensagem enviada",
      description: `Mensagem de ${type} enviada para ${whatsappModal?.client_name}`,
    });
    
    setWhatsappModal(null);
  };

  const handleCreateNewAppointment = () => {
    navigate('/admin/create-appointment');
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
          <Button onClick={handleCreateNewAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Marcação
          </Button>
          
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
              <CalendarIcon className="h-8 w-8 text-blue-600" />
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
                        <h3 className="text-lg font-semibold">
                          {appointment.clients?.name || appointment.client_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.time_slots?.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select 
                        value={appointment.status} 
                        onValueChange={(value) => handleStatusChange(appointment.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

                  {appointment.next_session_date && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Próxima Sessão:</strong> {format(new Date(appointment.next_session_date), 'dd/MM/yyyy', { locale: pt })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex flex-col space-y-2">
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

      {/* WhatsApp Message Selector */}
      {whatsappModal && (
        <WhatsAppMessageSelector
          isOpen={!!whatsappModal}
          onClose={() => setWhatsappModal(null)}
          appointment={whatsappModal}
          onSend={handleWhatsAppSend}
        />
      )}
    </div>
  );
};

export default AppointmentsManager;
