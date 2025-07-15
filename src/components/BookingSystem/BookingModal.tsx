
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, User } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useTimeSlots, useBusinessHours, useBookedSlotsForDate, useCreateAppointment } from '@/hooks/useAppointments';
import type { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;

interface BookingModalProps {
  children: React.ReactNode;
}

const BookingModal: React.FC<BookingModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data as Service[];
    }
  });

  const { data: timeSlots } = useTimeSlots();
  const { data: businessHours } = useBusinessHours();
  const { data: bookedSlots } = useBookedSlotsForDate(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
  const createAppointmentMutation = useCreateAppointment();

  const resetForm = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTimeSlot(undefined);
    setSelectedServices([]);
    setClientData({ name: '', phone: '', email: '', notes: '' });
  };

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
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTimeSlot || selectedServices.length === 0) return;

    createAppointmentMutation.mutate({
      client_name: clientData.name,
      client_phone: clientData.phone,
      client_email: clientData.email || undefined,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      time_slot_id: selectedTimeSlot,
      notes: clientData.notes || undefined,
      service_ids: selectedServices
    }, {
      onSuccess: () => {
        setIsOpen(false);
        resetForm();
      }
    });
  };

  const canProceedFromStep1 = selectedServices.length > 0;
  const canProceedFromStep2 = selectedDate && selectedTimeSlot;
  const canSubmit = clientData.name && clientData.phone;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Marcar Consulta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 3 && <div className={`w-8 h-0.5 ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Services */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Selecione os Serviços
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services?.map((service) => (
                  <Card key={service.id} className={`cursor-pointer transition-all ${
                    selectedServices.includes(service.id) ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.short_description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-semibold">{service.price_range}</span>
                            {service.duration_minutes && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duration_minutes}min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!canProceedFromStep1}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Date and Time */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Escolha Data e Hora
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Selecione a Data</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => !isDateAvailable(date)}
                    locale={pt}
                    className="rounded-md border"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <Label className="text-base font-medium">
                      Horários Disponíveis - {format(selectedDate, 'dd/MM/yyyy', { locale: pt })}
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {getAvailableTimeSlots().map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                          onClick={() => setSelectedTimeSlot(slot.id)}
                          className="text-sm"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!canProceedFromStep2}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Client Information */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Os Seus Dados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={clientData.name}
                    onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="O seu nome completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={clientData.phone}
                    onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+351 964 481 966"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seuemail@exemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={clientData.notes}
                  onChange={(e) => setClientData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Alguma informação adicional..."
                  rows={3}
                />
              </div>

              {/* Booking Summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Resumo da Marcação</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                      {selectedDate && format(selectedDate, 'dd/MM/yyyy', { locale: pt })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {timeSlots?.find(slot => slot.id === selectedTimeSlot)?.time}
                    </div>
                    <div className="border-t pt-2">
                      <strong>Serviços:</strong>
                      {services?.filter(s => selectedServices.includes(s.id)).map(service => (
                        <div key={service.id} className="ml-4">• {service.name}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!canSubmit || createAppointmentMutation.isPending}
                >
                  {createAppointmentMutation.isPending ? 'A Criar...' : 'Confirmar Marcação'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
