import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface DischargeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dischargeType: string, justification?: string) => void;
  patientName: string;
  requiresJustification: boolean;
  isLoading?: boolean;
}

const DISCHARGE_TYPES = [
  { value: 'ALTA MELHORADA', label: 'Alta Melhorada' },
  { value: 'ALTA A PEDIDO', label: 'Alta a Pedido' },
  { value: 'EVASÃO', label: 'Evasão' },
  { value: 'TRANSFERÊNCIA', label: 'Transferência' },
  { value: 'ÓBITO', label: 'Óbito' },
];

const DischargeTypeModal: React.FC<DischargeTypeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  requiresJustification,
  isLoading = false
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [justification, setJustification] = useState('');

  const handleConfirm = () => {
    if (!selectedType) return;
    
    if (requiresJustification && !justification.trim()) {
      return;
    }

    onConfirm(selectedType, requiresJustification ? justification : undefined);
    handleClose();
  };

  const handleClose = () => {
    setSelectedType('');
    setJustification('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Tipo de Alta - {patientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="discharge_type">Tipo de Alta*</Label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="mt-2">
              {DISCHARGE_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="text-sm font-normal cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {requiresJustification && (
            <div>
              <Label htmlFor="justification">
                Justificativa* <span className="text-xs text-muted-foreground">(obrigatória para altas com mais de 5h)</span>
              </Label>
              <Textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Digite a justificativa para o atraso na alta..."
                className="mt-1"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm} 
              disabled={!selectedType || (requiresJustification && !justification.trim()) || isLoading}
            >
              {isLoading ? 'Processando...' : 'Confirmar Alta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DischargeTypeModal;