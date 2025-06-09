
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department } from '@/types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetDepartment: string, targetBedId: string) => void;
  patientName: string;
  availableBeds: Array<{ id: string; name: string; department: string }>;
  currentDepartment: string;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patientName,
  availableBeds,
  currentDepartment
}) => {
  const [targetDepartment, setTargetDepartment] = useState('');
  const [targetBedId, setTargetBedId] = useState('');

  const departments: Department[] = [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  const filteredBeds = availableBeds.filter(bed => 
    bed.department === targetDepartment
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetDepartment && targetBedId) {
      onSubmit(targetDepartment, targetBedId);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTargetDepartment('');
    setTargetBedId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDepartmentChange = (department: string) => {
    setTargetDepartment(department);
    setTargetBedId(''); // Reset bed selection when department changes
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Paciente - {patientName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="target_department">Departamento de Destino*</Label>
            <Select value={targetDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter(dept => dept !== currentDepartment)
                  .map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {targetDepartment && (
            <div>
              <Label htmlFor="target_bed">Leito de Destino*</Label>
              <Select value={targetBedId} onValueChange={setTargetBedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o leito" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBeds.map(bed => (
                    <SelectItem key={bed.id} value={bed.id}>
                      {bed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!targetDepartment || !targetBedId}>
              Confirmar Transferência
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
