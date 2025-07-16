
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  time: string;
  duration_minutes: number;
  is_available: boolean;
  max_concurrent: number;
}

const TimeSlotManager: React.FC = () => {
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: timeSlots, isLoading } = useQuery({
    queryKey: ['admin-time-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('time', { ascending: true });
      
      if (error) throw error;
      return data as TimeSlot[];
    }
  });

  const createSlotMutation = useMutation({
    mutationFn: async (slot: Omit<TimeSlot, 'id'>) => {
      const { data, error } = await supabase
        .from('time_slots')
        .insert([slot])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-time-slots'] });
      toast.success('Horário criado com sucesso!');
      setShowForm(false);
      setEditingSlot(null);
    },
    onError: () => {
      toast.error('Erro ao criar horário');
    }
  });

  const updateSlotMutation = useMutation({
    mutationFn: async ({ id, ...slot }: TimeSlot) => {
      const { data, error } = await supabase
        .from('time_slots')
        .update(slot)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-time-slots'] });
      toast.success('Horário atualizado com sucesso!');
      setShowForm(false);
      setEditingSlot(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar horário');
    }
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-time-slots'] });
      toast.success('Horário eliminado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar horário');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const slotData = {
      time: formData.get('time') as string,
      duration_minutes: parseInt(formData.get('duration_minutes') as string) || 60,
      is_available: formData.get('is_available') === 'on',
      max_concurrent: parseInt(formData.get('max_concurrent') as string) || 1
    };

    if (editingSlot) {
      updateSlotMutation.mutate({ ...slotData, id: editingSlot.id });
    } else {
      createSlotMutation.mutate(slotData);
    }
  };

  const startEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingSlot(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Horários</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Horários</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Horário
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSlot ? 'Editar Horário' : 'Novo Horário'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="time"
                  type="time"
                  placeholder="Hora"
                  defaultValue={editingSlot?.time || ''}
                  required
                />
                <Input
                  name="duration_minutes"
                  type="number"
                  placeholder="Duração (minutos)"
                  defaultValue={editingSlot?.duration_minutes || 60}
                  required
                />
                <Input
                  name="max_concurrent"
                  type="number"
                  placeholder="Máximo simultâneo"
                  defaultValue={editingSlot?.max_concurrent || 1}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  name="is_available"
                  defaultChecked={editingSlot?.is_available ?? true}
                />
                <label>Disponível</label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingSlot ? 'Atualizar' : 'Criar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {timeSlots?.map((slot) => (
          <Card key={slot.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">{slot.time}</h3>
                    <p className="text-sm text-gray-600">
                      {slot.duration_minutes}min • Max: {slot.max_concurrent}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!slot.is_available && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      Indisponível
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(slot)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja eliminar este horário?')) {
                        deleteSlotMutation.mutate(slot.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotManager;
