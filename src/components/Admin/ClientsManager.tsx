
import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Search,
  History,
  Euro,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients';
import ClientHistoryModal from './ClientHistoryModal';

const ClientsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [selectedClientHistory, setSelectedClientHistory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const { data: clients, isLoading } = useClients();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

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
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      updateClientMutation.mutate({
        id: editingClient.id,
        ...formData
      });
    } else {
      createClientMutation.mutate(formData);
    }

    setFormData({ name: '', phone: '', email: '', notes: '' });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      notes: client.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      deleteClientMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Concluída';
      default: return status;
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingClient(null);
              setFormData({ name: '', phone: '', email: '', notes: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="9XX XXX XXX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
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
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingClient ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas dos Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold">{clients?.length || 0}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {clients?.filter(c => c.appointments?.some((a: any) => a.status === 'confirmed')).length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Marcações</p>
                <p className="text-2xl font-bold text-purple-600">
                  {clients?.reduce((sum, c) => sum + (c.appointments?.length || 0), 0) || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  €{clients?.reduce((sum, c) => 
                    sum + (c.appointments?.reduce((aptSum: number, apt: any) => aptSum + (apt.total_price || 0), 0) || 0), 0
                  ).toFixed(2) || '0.00'}
                </p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pesquisa */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar clientes por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClients.map((client) => {
          const totalSpent = client.appointments?.reduce((sum: number, apt: any) => sum + (apt.total_price || 0), 0) || 0;
          const completedSessions = client.appointments?.filter((apt: any) => apt.status === 'completed').length || 0;
          const nextAppointment = client.appointments?.find((apt: any) => 
            apt.status === 'confirmed' && new Date(apt.appointment_date) >= new Date()
          );

          return (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {client.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </span>
                          {client.email && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Estatísticas do Cliente */}
                      <div className="flex space-x-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-blue-600">{client.appointments?.length || 0}</p>
                          <p className="text-xs text-gray-500">Marcações</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">{completedSessions}</p>
                          <p className="text-xs text-gray-500">Concluídas</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-purple-600">€{totalSpent.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Total Gasto</p>
                        </div>
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{client.notes}</p>
                      </div>
                    )}

                    {/* Próxima Marcação */}
                    {nextAppointment && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Próxima Marcação:</strong> {format(new Date(nextAppointment.appointment_date), 'PPP', { locale: pt })}
                          {nextAppointment.time_slots && ` às ${nextAppointment.time_slots.time}`}
                        </p>
                      </div>
                    )}

                    {/* Últimas Marcações (preview) */}
                    {client.appointments && client.appointments.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <History className="h-4 w-4 mr-2" />
                            Últimas Marcações
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClientHistory(client)}
                          >
                            Ver Histórico Completo
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {client.appointments.slice(0, 3).map((appointment: any) => (
                            <div key={appointment.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                              <div>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
                                  {appointment.time_slots && ` às ${appointment.time_slots.time}`}
                                </span>
                                <span className="text-gray-600">
                                  {appointment.appointment_services?.map((s: any) => s.services?.name).join(', ')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(appointment.status)}>
                                  {getStatusLabel(appointment.status)}
                                </Badge>
                                {appointment.total_price && (
                                  <span className="font-medium">€{appointment.total_price}</span>
                                )}
                              </div>
                            </div>
                          ))}
                          {client.appointments.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{client.appointments.length - 3} marcações anteriores
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredClients.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum cliente encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Histórico Completo */}
      {selectedClientHistory && (
        <ClientHistoryModal
          client={selectedClientHistory}
          isOpen={!!selectedClientHistory}
          onClose={() => setSelectedClientHistory(null)}
        />
      )}
    </div>
  );
};

export default ClientsManager;
