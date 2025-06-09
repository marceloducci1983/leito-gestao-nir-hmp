
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dischargeType: string) => void;
  patientName: string;
}

const DischargeModal: React.FC<DischargeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patientName
}) => {
  const [dischargeType, setDischargeType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dischargeType) {
      onSubmit(dischargeType);
      setDischargeType('');
      onClose();
    }
  };

  const handleClose = () => {
    setDischargeType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dar Alta - {patientName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="discharge_type">Tipo de Alta*</Label>
            <Select value={dischargeType} onValueChange={setDischargeType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de alta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POR MELHORA">Por Melhora</SelectItem>
                <SelectItem value="EVASÃO">Evasão</SelectItem>
                <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                <SelectItem value="OBITO">Óbito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!dischargeType}>
              Confirmar Alta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DischargeModal;
