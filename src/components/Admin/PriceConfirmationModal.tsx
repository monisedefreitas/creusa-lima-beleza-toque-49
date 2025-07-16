
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calculator, Euro, CheckCircle } from 'lucide-react';

interface PriceConfirmationModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (finalPrice: number, notes?: string) => void;
}

const PriceConfirmationModal: React.FC<PriceConfirmationModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [serviceAdjustments, setServiceAdjustments] = useState<Record<string, number>>({});

  useEffect(() => {
    if (appointment) {
      // Definir preço inicial como o total_price ou soma dos serviços
      const initialPrice = appointment.final_price || appointment.total_price || 0;
      setFinalPrice(initialPrice.toString());
      
      // Inicializar ajustes de serviços com preços atuais
      const adjustments: Record<string, number> = {};
      appointment.appointment_services?.forEach((service: any) => {
        adjustments[service.service_id] = service.price;
      });
      setServiceAdjustments(adjustments);
      
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

  const handleServicePriceChange = (serviceId: string, price: number) => {
    setServiceAdjustments(prev => ({
      ...prev,
      [serviceId]: price
    }));
    
    // Recalcular preço total automaticamente
    const total = Object.values({
      ...serviceAdjustments,
      [serviceId]: price
    }).reduce((sum, price) => sum + price, 0);
    
    setFinalPrice(total.toFixed(2));
  };

  const handleConfirm = () => {
    const price = parseFloat(finalPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }
    
    onConfirm(price, notes);
  };

  const calculateTotal = () => {
    return Object.values(serviceAdjustments).reduce((sum, price) => sum + price, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Confirmar Valor Final - {appointment?.client_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações da Marcação */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Detalhes da Marcação</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Data:</span> {appointment?.appointment_date}
              </div>
              <div>
                <span className="text-gray-600">Horário:</span> {appointment?.time_slots?.time}
              </div>
              <div>
                <span className="text-gray-600">Valor Estimado:</span> €{appointment?.total_price || 0}
              </div>
              <div>
                <span className="text-gray-600">Estado:</span> {appointment?.status}
              </div>
            </div>
          </div>

          {/* Serviços e Preços */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Serviços e Valores</h3>
            <div className="space-y-3">
              {appointment?.appointment_services?.map((service: any) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{service.services?.name}</p>
                    <p className="text-sm text-gray-600">
                      Preço sugerido: €{service.services?.price_range}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={serviceAdjustments[service.service_id] || service.price}
                      onChange={(e) => handleServicePriceChange(service.service_id, parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Valor Final */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="finalPrice">Valor Final Total</Label>
              <div className="flex items-center gap-2 mt-1">
                <Euro className="h-4 w-4 text-gray-500" />
                <Input
                  id="finalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  className="font-medium text-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Soma dos serviços: €{calculateTotal().toFixed(2)}
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Observações sobre o Preço (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Desconto aplicado, serviços extras, etc..."
                rows={3}
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Valor e Marcação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceConfirmationModal;
