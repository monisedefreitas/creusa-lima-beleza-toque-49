
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface Service {
  id: string;
  name: string;
  price_range: string;
}

interface TimeSlot {
  id: string;
  time: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

const FixedAppointmentsManager: React.FC = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    appointment_date: null as Date | null,
    time_slot_id: '',
    notes: '',
    status: 'confirmed',
    selected_services: [] as string[],
  });

  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClientSelect, setShowClientSelect] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
    fetchTimeSlots();
    fetchClients();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price_range')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('id, time')
        .eq('is_available', true)
        .order('time');

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, phone, email')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData(prev => ({
        ...prev,
        client_name: client.name,
        client_phone: client.phone,
        client_email: client.email || '',
      }));
      setSelectedClientId(clientId);
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selected_services: checked 
        ? [...prev.selected_services, serviceId]
        : prev.selected_services.filter(id => id !== serviceId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name.trim() || !formData.client_phone.trim() || 
        !formData.appointment_date || !formData.time_slot_id || 
        formData.selected_services.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create or update client
      let clientId = selectedClientId;
      
      if (!clientId) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .insert([{
            name: formData.client_name,
            phone: formData.client_phone,
            email: formData.client_email || null,
          }])
          .select()
          .single();

        if (clientError) throw clientError;
        clientId = clientData.id;
      }

      // Create appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          client_id: clientId,
          client_name: formData.client_name,
          client_phone: formData.client_phone,
          client_email: formData.client_email || null,
          appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
          time_slot_id: formData.time_slot_id,
          notes: formData.notes || null,
          status: formData.status,
        }])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create appointment services
      if (formData.selected_services.length > 0) {
        const appointmentServices = formData.selected_services.map(serviceId => ({
          appointment_id: appointmentData.id,
          service_id: serviceId,
          price: 0, // You might want to get actual prices
        }));

        const { error: servicesError } = await supabase
          .from('appointment_services')
          .insert(appointmentServices);

        if (servicesError) throw servicesError;
      }

      toast({
        title: "Sucesso",
        description: "Marcação criada com sucesso!",
      });

      // Reset form
      setFormData({
        client_name: '',
        client_phone: '',
        client_email: '',
        appointment_date: null,
        time_slot_id: '',
        notes: '',
        status: 'confirmed',
        selected_services: [],
      });
      setSelectedClientId('');
      setShowClientSelect(false);

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar marcação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Criar Nova Marcação</h1>
        <p className="text-gray-600 mt-2">
          Criar uma nova marcação manualmente para um cliente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Marcação</CardTitle>
          <CardDescription>
            Preencha todos os campos para criar uma nova marcação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Dados do Cliente</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClientSelect(!showClientSelect)}
                >
                  {showClientSelect ? 'Novo Cliente' : 'Cliente Existente'}
                </Button>
              </div>

              {showClientSelect && (
                <div className="space-y-2">
                  <Label htmlFor="existing-client">Selecionar Cliente Existente</Label>
                  <Select onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Nome *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_phone">Telefone *</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data da Marcação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.appointment_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.appointment_date ? (
                        format(formData.appointment_date, "PPP", { locale: pt })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.appointment_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, appointment_date: date }))}
                      initialFocus
                      locale={pt}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_slot">Horário *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, time_slot_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um horário..." />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Serviços *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={formData.selected_services.includes(service.id)}
                      onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`service-${service.id}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {service.name}
                      {service.price_range && (
                        <span className="text-gray-500 ml-1">({service.price_range})</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas adicionais..."
                  rows={3}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Criando Marcação...' : 'Criar Marcação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixedAppointmentsManager;
