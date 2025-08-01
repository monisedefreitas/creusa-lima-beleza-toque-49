import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useServiceAvailability, useCreateServiceAvailability, useUpdateServiceAvailability, useDeleteServiceAvailability } from '@/hooks/useServiceAvailability';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export const ServiceAvailabilityManager = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAvailability, setNewAvailability] = useState({
    service_id: '',
    days_of_week: [] as number[],
    specific_time_slots: [] as string[],
    is_active: true,
  });

  const { data: services = [] } = useServices();
  const { data: timeSlots = [] } = useTimeSlots();
  const { data: availabilities = [] } = useServiceAvailability();
  const createMutation = useCreateServiceAvailability();
  const updateMutation = useUpdateServiceAvailability();
  const deleteMutation = useDeleteServiceAvailability();

  const handleCreate = async () => {
    if (!newAvailability.service_id || newAvailability.days_of_week.length === 0) {
      toast.error('Selecione um serviço e pelo menos um dia da semana');
      return;
    }

    await createMutation.mutateAsync(newAvailability);
    setNewAvailability({
      service_id: '',
      days_of_week: [],
      specific_time_slots: [],
      is_active: true,
    });
  };

  const handleUpdate = async (id: string, updates: any) => {
    await updateMutation.mutateAsync({ id, ...updates });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem a certeza que pretende eliminar esta configuração?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const toggleDay = (day: number, currentDays: number[], onChange: (days: number[]) => void) => {
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    onChange(newDays);
  };

  const toggleTimeSlot = (slotId: string, currentSlots: string[], onChange: (slots: string[]) => void) => {
    const newSlots = currentSlots.includes(slotId)
      ? currentSlots.filter(s => s !== slotId)
      : [...currentSlots, slotId];
    onChange(newSlots);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Disponibilidade de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="service">Serviço</Label>
            <Select value={newAvailability.service_id} onValueChange={(value) => 
              setNewAvailability(prev => ({ ...prev, service_id: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dias da Semana</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={newAvailability.days_of_week.includes(day.value)}
                    onCheckedChange={() => 
                      toggleDay(day.value, newAvailability.days_of_week, (days) => 
                        setNewAvailability(prev => ({ ...prev, days_of_week: days }))
                      )
                    }
                  />
                  <Label htmlFor={`day-${day.value}`} className="text-sm">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Horários Específicos (opcional)</Label>
            <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`slot-${slot.id}`}
                    checked={newAvailability.specific_time_slots.includes(slot.id)}
                    onCheckedChange={() => 
                      toggleTimeSlot(slot.id, newAvailability.specific_time_slots, (slots) => 
                        setNewAvailability(prev => ({ ...prev, specific_time_slots: slots }))
                      )
                    }
                  />
                  <Label htmlFor={`slot-${slot.id}`} className="text-sm">
                    {slot.time}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'A criar...' : 'Criar Disponibilidade'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disponibilidades Configuradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilities.map((availability) => {
              const service = services.find(s => s.id === availability.service_id);
              const isEditing = editingId === availability.id;

              return (
                <div key={availability.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{service?.name}</h4>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(availability.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(availability.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>Dias:</strong>{' '}
                      {availability.days_of_week.map(day => 
                        DAYS_OF_WEEK.find(d => d.value === day)?.label
                      ).join(', ')}
                    </p>
                    {availability.specific_time_slots.length > 0 && (
                      <p>
                        <strong>Horários específicos:</strong>{' '}
                        {availability.specific_time_slots.map(slotId => {
                          const slot = timeSlots.find(s => s.id === slotId);
                          return slot?.time;
                        }).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {availabilities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma disponibilidade configurada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};