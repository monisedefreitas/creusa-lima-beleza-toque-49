
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean | null;
  order_index: number | null;
}

const FAQsManager: React.FC = () => {
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as FAQ[];
    }
  });

  const createFAQMutation = useMutation({
    mutationFn: async (faq: Omit<FAQ, 'id'>) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      toast.success('FAQ criada com sucesso!');
      setShowForm(false);
      setEditingFAQ(null);
    },
    onError: () => {
      toast.error('Erro ao criar FAQ');
    }
  });

  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, ...faq }: FAQ) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(faq)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      toast.success('FAQ atualizada com sucesso!');
      setShowForm(false);
      setEditingFAQ(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar FAQ');
    }
  });

  const deleteFAQMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      toast.success('FAQ eliminada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao eliminar FAQ');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const faqData = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
      category: formData.get('category') as string || null,
      is_active: formData.get('is_active') === 'on',
      order_index: parseInt(formData.get('order_index') as string) || 0
    };

    if (editingFAQ) {
      updateFAQMutation.mutate({ ...faqData, id: editingFAQ.id });
    } else {
      createFAQMutation.mutate(faqData);
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingFAQ(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de FAQs</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Gestão de FAQs</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova FAQ
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingFAQ ? 'Editar FAQ' : 'Nova FAQ'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="category"
                  placeholder="Categoria"
                  defaultValue={editingFAQ?.category || ''}
                />
                <Input
                  name="order_index"
                  type="number"
                  placeholder="Ordem de exibição"
                  defaultValue={editingFAQ?.order_index || 0}
                />
              </div>
              
              <Input
                name="question"
                placeholder="Pergunta"
                defaultValue={editingFAQ?.question || ''}
                required
              />
              
              <Textarea
                name="answer"
                placeholder="Resposta"
                defaultValue={editingFAQ?.answer || ''}
                rows={4}
                required
              />

              <div className="flex items-center space-x-2">
                <Switch
                  name="is_active"
                  defaultChecked={editingFAQ?.is_active ?? true}
                />
                <label>Ativa</label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingFAQ ? 'Atualizar' : 'Criar'}
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

      <div className="grid gap-4">
        {faqs?.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    {!faq.is_active && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        Inativa
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{faq.answer}</p>
                  {faq.category && (
                    <span className="text-sm text-gray-500">
                      Categoria: {faq.category}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(faq)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem a certeza que deseja eliminar esta FAQ?')) {
                        deleteFAQMutation.mutate(faq.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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

export default FAQsManager;
