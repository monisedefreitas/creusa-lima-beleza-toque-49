import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, Edit, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useScheduleBlocks, useCreateScheduleBlock, useUpdateScheduleBlock, useDeleteScheduleBlock } from '@/hooks/useScheduleBlocks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const ScheduleBlocksManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newBlock, setNewBlock] = useState({
    block_date: '',
    block_type: 'full_day' as 'full_day' | 'partial_day',
    blocked_time_slots: [] as string[],
    reason: '',
    is_active: true,
  });

  const { data: timeSlots = [] } = useTimeSlots();
  const { data: scheduleBlocks = [] } = useScheduleBlocks();
  const createMutation = useCreateScheduleBlock();
  const updateMutation = useUpdateScheduleBlock();
  const deleteMutation = useDeleteScheduleBlock();

  const handleCreate = async () => {
    if (!newBlock.block_date) {
      toast.error('Selecione uma data');
      return;
    }

    if (newBlock.block_type === 'partial_day' && newBlock.blocked_time_slots.length === 0) {
      toast.error('Para bloqueio parcial, selecione pelo menos um horário');
      return;
    }

    await createMutation.mutateAsync(newBlock);
    setNewBlock({
      block_date: '',
      block_type: 'full_day',
      blocked_time_slots: [],
      reason: '',
      is_active: true,
    });
    setSelectedDate(undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem a certeza que pretende eliminar este bloqueio?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const toggleTimeSlot = (slotId: string) => {
    const newSlots = newBlock.blocked_time_slots.includes(slotId)
      ? newBlock.blocked_time_slots.filter(s => s !== slotId)
      : [...newBlock.blocked_time_slots, slotId];
    setNewBlock(prev => ({ ...prev, blocked_time_slots: newSlots }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setNewBlock(prev => ({ ...prev, block_date: format(date, 'yyyy-MM-dd') }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Bloqueio de Agenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Data do Bloqueio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  locale={pt}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Tipo de Bloqueio</Label>
            <Select value={newBlock.block_type} onValueChange={(value: 'full_day' | 'partial_day') => 
              setNewBlock(prev => ({ ...prev, block_type: value, blocked_time_slots: [] }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_day">Dia Completo</SelectItem>
                <SelectItem value="partial_day">Bloqueio Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newBlock.block_type === 'partial_day' && (
            <div>
              <Label>Horários a Bloquear</Label>
              <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`block-slot-${slot.id}`}
                      checked={newBlock.blocked_time_slots.includes(slot.id)}
                      onCheckedChange={() => toggleTimeSlot(slot.id)}
                    />
                    <Label htmlFor={`block-slot-${slot.id}`} className="text-sm">
                      {slot.time}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="reason">Motivo do Bloqueio</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Feriado, Férias, Manutenção..."
              value={newBlock.reason}
              onChange={(e) => setNewBlock(prev => ({ ...prev, reason: e.target.value }))}
            />
          </div>

          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'A criar...' : 'Criar Bloqueio'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bloqueios Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleBlocks.map((block) => (
              <div key={block.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">
                    {format(new Date(block.block_date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                  </h4>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(block.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Tipo:</strong>{' '}
                    {block.block_type === 'full_day' ? 'Dia Completo' : 'Bloqueio Parcial'}
                  </p>
                  
                  {block.block_type === 'partial_day' && block.blocked_time_slots.length > 0 && (
                    <p>
                      <strong>Horários bloqueados:</strong>{' '}
                      {block.blocked_time_slots.map(slotId => {
                        const slot = timeSlots.find(s => s.id === slotId);
                        return slot?.time;
                      }).join(', ')}
                    </p>
                  )}
                  
                  {block.reason && (
                    <p>
                      <strong>Motivo:</strong> {block.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {scheduleBlocks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum bloqueio configurado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};