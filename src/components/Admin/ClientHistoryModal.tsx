
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Euro, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ClientHistoryModalProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
}

const ClientHistoryModal: React.FC<ClientHistoryModalProps> = ({
  client,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  if (!client) return null;

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

  const filteredAppointments = client.appointments?.filter((appointment: any) => {
    const matchesSearch = appointment.appointment_services?.some((service: any) => 
      service.services?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    const appointmentDate = new Date(appointment.appointment_date);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    let matchesDate = true;
    if (dateFilter === '30days') {
      matchesDate = appointmentDate >= thirtyDaysAgo;
    } else if (dateFilter === '90days') {
      matchesDate = appointmentDate >= ninetyDaysAgo;
    } else if (dateFilter === 'year') {
      matchesDate = appointmentDate.getFullYear() === now.getFullYear();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  const totalAppointments = client.appointments?.length || 0;
  const totalSpent = client.appointments?.reduce((sum: number, apt: any) => sum + (apt.total_price || 0), 0) || 0;
  const completedAppointments = client.appointments?.filter((apt: any) => apt.status === 'completed').length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Histórico de {client.name}
          </DialogTitle>
        </DialogHeader>

        {/* Estatísticas do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalAppointments}</div>
              <div className="text-sm text-gray-600">Total de Marcações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedAppointments}</div>
              <div className="text-sm text-gray-600">Sessões Concluídas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">€{totalSpent.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Gasto</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar serviços ou observações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Datas</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Marcações */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma marcação encontrada com os filtros aplicados.
            </div>
          ) : (
            filteredAppointments.map((appointment: any) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(appointment.appointment_date), 'PPP', { locale: pt })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time_slots?.time}
                        </div>
                        {appointment.total_price && (
                          <div className="flex items-center text-sm font-medium">
                            <Euro className="h-4 w-4 mr-1" />
                            {appointment.total_price}
                          </div>
                        )}
                      </div>

                      {appointment.appointment_services && appointment.appointment_services.length > 0 && (
                        <div className="mb-2">
                          <div className="text-sm font-medium text-gray-700 mb-1">Serviços:</div>
                          <div className="space-y-1">
                            {appointment.appointment_services.map((service: any) => (
                              <div key={service.id} className="text-sm text-gray-600">
                                • {service.services?.name} (€{service.price})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Observações:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientHistoryModal;
