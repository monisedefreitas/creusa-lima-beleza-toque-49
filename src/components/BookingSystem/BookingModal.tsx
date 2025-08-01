
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarDays, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAvailableSlots } from '@/hooks/useAvailableSlots';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price_range: string | null;
  duration_minutes: number | null;
}

interface TimeSlot {
  id: string;
  time: string;
  duration_minutes: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preSelectedServiceId }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Get the first selected service for availability checking
  const firstServiceId = selectedServices.length > 0 ? selectedServices[0].id : undefined;
  const { availableSlots, isDateAvailable, getUnavailabilityReason } = useAvailableSlots(selectedDate || new Date(), firstServiceId);

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchTimeSlots();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preSelectedServiceId && services.length > 0) {
      const preSelectedService = services.find(service => service.id === preSelectedServiceId);
      if (preSelectedService) {
        setSelectedServices([preSelectedService]);
      }
    }
  }, [preSelectedServiceId, services]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
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
        .select('*')
        .eq('is_available', true)
        .order('time');

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, service]);
    } else {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot || selectedServices.length === 0 || !clientInfo.name || !clientInfo.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          client_name: clientInfo.name,
          client_phone: clientInfo.phone,
          client_email: clientInfo.email || null,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot_id: selectedTimeSlot.id,
          notes: clientInfo.notes || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create appointment services
      if (selectedServices.length > 0) {
        const appointmentServices = selectedServices.map(service => ({
          appointment_id: appointmentData.id,
          service_id: service.id,
          price: 0
        }));

        const { error: servicesError } = await supabase
          .from('appointment_services')
          .insert(appointmentServices);

        if (servicesError) throw servicesError;
      }

      toast({
        title: "Sucesso!",
        description: "Marcação enviada com sucesso. Entraremos em contacto em breve.",
      });

      // Reset form and close modal
      resetForm();
      onClose();

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar marcação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedServices([]);
    setClientInfo({
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return selectedServices.length > 0;
      case 2:
        return selectedDate !== undefined && isDateAvailable;
      case 3:
        return selectedTimeSlot !== null && availableSlots.some(slot => slot.id === selectedTimeSlot.id);
      case 4:
        return clientInfo.name.trim() !== '' && clientInfo.phone.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-pink-600">
            Marcar Consulta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNumber
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>

          {/* Step 1: Select Services */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Escolha os Serviços</h3>
              <div className="grid gap-3">
                {services.map((service) => (
                  <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.some(s => s.id === service.id)}
                          onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={`service-${service.id}`}
                            className="text-base font-medium cursor-pointer"
                            onClick={() => {
                              const isChecked = selectedServices.some(s => s.id === service.id);
                              handleServiceToggle(service, !isChecked);
                            }}
                          >
                            {service.name}
                          </Label>
                          {service.price_range && (
                            <Badge variant="outline" className="ml-2">
                              {service.price_range}
                            </Badge>
                          )}
                          {service.duration_minutes && (
                            <p className="text-sm text-gray-500 mt-1">
                              Duração: {service.duration_minutes} minutos
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Escolha a Data
              </h3>
              
              {selectedDate && !isDateAvailable && getUnavailabilityReason && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {getUnavailabilityReason}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={pt}
                  disabled={(date) => {
                    if (date < new Date()) return true;
                    
                    // Check if date is available for the selected service
                    if (firstServiceId) {
                      const dayOfWeek = date.getDay();
                      // This is a simplified check - the full logic is in useAvailableSlots
                      return false; // Let the hook handle the detailed validation
                    }
                    
                    return false;
                  }}
                  className="rounded-md border"
                />
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Escolha o Horário
              </h3>
              
              {availableSlots.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Não há horários disponíveis para esta data. Tente escolher outra data.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className="h-12"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Client Information */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Seus Dados
              </h3>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome *
                  </Label>
                  <Input
                    id="name"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Observações
                  </Label>
                  <Textarea
                    id="notes"
                    value={clientInfo.notes}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Alguma observação especial..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-2">
                <h4 className="font-semibold">Resumo da Marcação:</h4>
                <p><strong>Serviços:</strong> {selectedServices.map(s => s.name).join(', ')}</p>
                <p><strong>Data:</strong> {selectedDate && format(selectedDate, 'dd/MM/yyyy', { locale: pt })}</p>
                <p><strong>Horário:</strong> {selectedTimeSlot?.time}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            >
              {step > 1 ? 'Anterior' : 'Cancelar'}
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(step) || isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar Marcação'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
