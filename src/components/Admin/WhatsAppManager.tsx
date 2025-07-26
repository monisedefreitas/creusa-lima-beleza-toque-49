
import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, MessageSquare, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useMessageTemplates, 
  useCreateMessageTemplate, 
  useUpdateMessageTemplate, 
  useDeleteMessageTemplate 
} from '@/hooks/useMessageTemplates';
import { getAvailableVariables, getVariableDescriptions } from '@/utils/messageTemplates';

const WhatsAppManager: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { toast } = useToast();

  const { data: templates, isLoading } = useMessageTemplates();
  const createMutation = useCreateMessageTemplate();
  const updateMutation = useUpdateMessageTemplate();
  const deleteMutation = useDeleteMessageTemplate();

  const availableVariables = getAvailableVariables();
  const variableDescriptions = getVariableDescriptions();

  const handleEdit = (template: any) => {
    setIsEditing(template.id);
    setEditForm(template);
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.content) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (isEditing === 'new') {
      createMutation.mutate({
        name: editForm.name,
        type: editForm.type || 'whatsapp_confirmation',
        content: editForm.content,
        variables: editForm.variables || [],
        is_default: editForm.is_default || false
      });
    } else if (isEditing) {
      updateMutation.mutate({
        id: isEditing,
        name: editForm.name,
        content: editForm.content,
        variables: editForm.variables || [],
        is_active: editForm.is_active,
        is_default: editForm.is_default
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    setIsEditing('new');
    setEditForm({
      name: '',
      type: 'whatsapp_confirmation',
      content: '',
      variables: [],
      is_active: true,
      is_default: false
    });
  };

  const insertVariable = (variable: string) => {
    const newContent = editForm.content + `{{${variable}}}`;
    setEditForm({ ...editForm, content: newContent });
  };

  if (isLoading) {
    return <div>Carregando templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Templates WhatsApp</h1>
          <p className="text-gray-600 mt-2">Gerir templates de mensagens para WhatsApp</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <div className="grid gap-6">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.type}
                    </span>
                    {template.is_default && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Padrão
                      </span>
                    )}
                    {!template.is_active && (
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        Inativo
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing === template.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Nome do template"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={editForm.type}
                        onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp_confirmation">Confirmação</SelectItem>
                          <SelectItem value="whatsapp_arrival_confirmation">Confirmação de Vinda</SelectItem>
                          <SelectItem value="whatsapp_review_request">Pedido de Avaliação</SelectItem>
                          <SelectItem value="whatsapp_reminder">Lembrete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Conteúdo da Mensagem</Label>
                    <Textarea
                      value={editForm.content || ''}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      placeholder="Digite sua mensagem aqui..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <Label>Variáveis Disponíveis</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {availableVariables.map((variable) => (
                        <Button
                          key={variable}
                          variant="outline"
                          size="sm"
                          onClick={() => insertVariable(variable)}
                          className="text-xs"
                        >
                          {variable}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Clique nas variáveis para inserir no conteúdo
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editForm.is_default || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_default: checked })}
                        />
                        <Label>Template Padrão</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editForm.is_active !== false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                        />
                        <Label>Ativo</Label>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>
                        Guardar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {template.content}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {isEditing === 'new' && (
          <Card>
            <CardHeader>
              <CardTitle>Novo Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Nome do template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={editForm.type}
                      onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp_confirmation">Confirmação</SelectItem>
                        <SelectItem value="whatsapp_arrival_confirmation">Confirmação de Vinda</SelectItem>
                        <SelectItem value="whatsapp_review_request">Pedido de Avaliação</SelectItem>
                        <SelectItem value="whatsapp_reminder">Lembrete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Conteúdo da Mensagem</Label>
                  <Textarea
                    value={editForm.content || ''}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    placeholder="Digite sua mensagem aqui..."
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <Label>Variáveis Disponíveis</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {availableVariables.map((variable) => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable)}
                        className="text-xs"
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.is_default || false}
                        onCheckedChange={(checked) => setEditForm({ ...editForm, is_default: checked })}
                      />
                      <Label>Template Padrão</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.is_active !== false}
                        onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                      />
                      <Label>Ativo</Label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      Criar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WhatsAppManager;
