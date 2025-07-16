
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Euro, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useTimeSlots, useBookedSlotsForDate } from '@/hooks/useAppointments';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppointmentEditModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

const AppointmentEditModal: React.FC<AppointmentEditModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    time_slot_id: '',
    notes: '',
    status: 'pending',
    next_session_date: ''
  });
  
  const [selectedServices, setSelectedServices] = useState<Array<{
    service_id: string;
    price: number;
  }>>([]);

  const { toast } = useToast();
  const { data: timeSlots } = useTimeSlots();
  const { data: bookedSlots } = useBookedSlotsForDate(
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  );

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

  useEffect(() => {
    if (appointment) {
      setFormData({
        client_name: appointment.client_name || '',
        client_phone: appointment.client_phone || '',
        client_email: appointment.client_email || '',
        time_slot_id: appointment.time_slot_id || '',
        notes: appointment.notes || '',
        status: appointment.status || 'pending',
        next_session_date: appointment.next_session_date || ''
      });
      
      if (appointment.appointment_date) {
        setSelectedDate(new Date(appointment.appointment_date));
      }

      // Carregar serviços da marcação
      if (appointment.appointment_services) {
        setSelectedServices(
          appointment.appointment_services.map((s: any) => ({
            service_id: s.service_id,
            price: s.price
          }))
        );
      }
    }
  }, [appointment]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.startsWith('351')) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    } else if (numbers.length === 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, client_phone: formatted }));
  };

  const getAvailableTimeSlots = () => {
    if (!timeSlots || !bookedSlots) return timeSlots || [];
    
    return timeSlots.filter(slot => 
      !bookedSlots.includes(slot.id) || slot.id === appointment?.time_slot_id
    );
  };

  const handleServiceToggle = (serviceId: string) => {
    const service = services?.find(s => s.id === serviceId);
    if (!service) return;

    const isSelected = selectedServices.some(s => s.service_id === serviceId);
    
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.service_id !== serviceId));
    } else {
      const defaultPrice = parseFloat(service.price_range?.split('-')[0]?.replace('€', '') || '0');
      setSelectedServices(prev => [...prev, { service_id: serviceId, price: defaultPrice }]);
    }
  };

  const handleServicePriceChange = (serviceId: string, price: number) => {
    setSelectedServices(prev => 
      prev.map(s => s.service_id === serviceId ? { ...s, price } : s)
    );
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Erro",
        description: "Selecione uma data para a marcação.",
        variant: "destructive",
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um serviço.",
        variant: "destructive",
      });
      return;
    }

    const updateData = {
      ...formData,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      services: selectedServices
    };

    onUpdate(updateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Marcação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Nome do Cliente *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="client_phone">Telefone *</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={handlePhoneChange}
                placeholder="9XX XXX XXX"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="client_email">Email</Label>
            <Input
              id="client_email"
              type="email"
              value={formData.client_email}
              onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data da Marcação *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: pt }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={pt}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Horário *</Label>
              <Select value={formData.time_slot_id} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, time_slot_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar horário" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots().map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Estado</Label>
            <Select value={formData.status} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, status: value }))
            }>
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

          <div>
            <Label>Serviços e Preços *</Label>
            <div className="space-y-4 mt-2">
              <div className="text-sm text-gray-600">
                Selecione os serviços e ajuste os preços individuais:
              </div>
              
              {services?.map((service) => {
                const isSelected = selectedServices.some(s => s.service_id === service.id);
                const selectedService = selectedServices.find(s => s.service_id === service.id);
                
                return (
                  <div key={service.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={isSelected}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <Label htmlFor={service.id} className="text-sm font-medium">
                        {service.name}
                      </Label>
                      <span className="text-xs text-gray-500">
                        (Preço padrão: {service.price_range})
                      </span>
                    </div>
                    
                    {isSelected && (
                      <div className="ml-6">
                        <Label className="text-sm">Preço personalizado</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={selectedService?.price || 0}
                            onChange={(e) => handleServicePriceChange(service.id, parseFloat(e.target.value) || 0)}
                            className="w-32"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {selectedServices.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total:</span>
                    <span className="text-lg">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="next_session">Próxima Sessão</Label>
            <Input
              id="next_session"
              type="date"
              value={formData.next_session_date}
              onChange={(e) => setFormData(prev => ({ ...prev, next_session_date: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Atualizar Marcação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentEditModal;
