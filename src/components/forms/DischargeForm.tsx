
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DischargeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dischargeType: 'POR MELHORA' | 'EVASÃO' | 'TRANSFERENCIA' | 'OBITO') => void;
  patientName: string;
}

const DischargeForm: React.FC<DischargeFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  patientName 
}) => {
  const [dischargeType, setDischargeType] = useState<'POR MELHORA' | 'EVASÃO' | 'TRANSFERENCIA' | 'OBITO'>('POR MELHORA');

  const handleSubmit = () => {
    onSubmit(dischargeType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dar Alta ao Paciente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Paciente:</strong> {patientName}</p>
          
          <div>
            <Label>Tipo de Alta:</Label>
            <RadioGroup
              value={dischargeType}
              onValueChange={(value) => setDischargeType(value as any)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="POR MELHORA" id="melhora" />
                <Label htmlFor="melhora">Por Melhora</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EVASÃO" id="evasao" />
                <Label htmlFor="evasao">Evasão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TRANSFERENCIA" id="transferencia" />
                <Label htmlFor="transferencia">Transferência</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OBITO" id="obito" />
                <Label htmlFor="obito">Óbito</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Confirmar Alta
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DischargeForm;
