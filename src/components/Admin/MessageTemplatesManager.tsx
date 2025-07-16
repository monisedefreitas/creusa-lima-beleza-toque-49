
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Eye,
  Copy
} from 'lucide-react';
import { 
  useMessageTemplates, 
  useCreateMessageTemplate, 
  useUpdateMessageTemplate, 
  useDeleteMessageTemplate 
} from '@/hooks/useMessageTemplates';
import { 
  getAvailableVariables, 
  getVariableDescriptions, 
  processMessageTemplate 
} from '@/utils/messageTemplates';

const MessageTemplatesManager: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  
  const { data: templates, isLoading } = useMessageTemplates();
  const createMutation = useCreateMessageTemplate();
  const updateMutation = useUpdateMessageTemplate();
  const deleteMutation = useDeleteMessageTemplate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'whatsapp_confirmation',
    content: '',
    subject: '',
    is_default: false
  });

  const availableVariables = getAvailableVariables();
  const variableDescriptions = getVariableDescriptions();

  const handleCreate = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({
          name: '',
          type: 'whatsapp_confirmation',
          content: '',
          subject: '',
          is_default: false
        });
      }
    });
  };

  const handleUpdate = () => {
    if (!editingTemplate) return;
    
    updateMutation.mutate({
      id: editingTemplate.id,
      ...formData
    }, {
      onSuccess: () => {
        setEditingTemplate(null);
        setFormData({
          name: '',
          type: 'whatsapp_confirmation',
          content: '',
          subject: '',
          is_default: false
        });
      }
    });
  };

  const startEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      content: template.content,
      subject: template.subject || '',
      is_default: template.is_default
    });
  };

  const insertVariable = (variable: string) => {
    const placeholder = `{{${variable}}}`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + placeholder
    }));
  };

  const previewMessage = (template: any) => {
    const sampleVariables = {
      client_name: 'Maria Silva',
      appointment_date: '15/01/2024',
      appointment_time: '14:30',
      services_list: '• Limpeza de Pele (€45)\n• Hidratação Facial (€35)',
      total_price: '€80',
      clinic_name: 'Clínica Exemplo'
    };

    return processMessageTemplate(template.content, sampleVariables);
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
        <h1 className="text-3xl font-bold text-gray-900">Templates de Mensagens</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Nome do Template</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do template..."
                  />
                </div>
                
                <div>
                  <Label>Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp_confirmation">Confirmação WhatsApp</SelectItem>
                      <SelectItem value="email_confirmation">Confirmação Email</SelectItem>
                      <SelectItem value="reminder">Lembrete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Assunto (opcional)</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Assunto da mensagem..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                  />
                  <Label>Template padrão</Label>
                </div>

                <div>
                  <Label>Conteúdo da Mensagem</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Conteúdo da mensagem..."
                    rows={10}
                  />
                </div>

                <Button onClick={handleCreate} className="w-full">
                  Criar Template
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Variáveis Disponíveis</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {availableVariables.map((variable) => (
                      <div key={variable} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-mono text-sm">{{'{' + variable + '}'}}}</span>
                          <p className="text-xs text-gray-600">{variableDescriptions[variable]}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => insertVariable(variable)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {template.is_default && (
                    <Badge variant="default">Padrão</Badge>
                  )}
                  <Badge variant="outline">{template.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600 line-clamp-3">
                  {template.content.substring(0, 100)}...
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(template)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Nome do Template</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp_confirmation">Confirmação WhatsApp</SelectItem>
                    <SelectItem value="email_confirmation">Confirmação Email</SelectItem>
                    <SelectItem value="reminder">Lembrete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assunto (opcional)</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                />
                <Label>Template padrão</Label>
              </div>

              <div>
                <Label>Conteúdo da Mensagem</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                />
              </div>

              <Button onClick={handleUpdate} className="w-full">
                Atualizar Template
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Variáveis Disponíveis</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {availableVariables.map((variable) => (
                    <div key={variable} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-mono text-sm">{{'{' + variable + '}'}}}</span>
                        <p className="text-xs text-gray-600">{variableDescriptions[variable]}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Mensagem com dados de exemplo:</h4>
              <div className="whitespace-pre-wrap">
                {previewTemplate && previewMessage(previewTemplate)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Template original:</h4>
              <div className="whitespace-pre-wrap text-sm text-gray-600">
                {previewTemplate?.content}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageTemplatesManager;
