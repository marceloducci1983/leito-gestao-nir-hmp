
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Department } from '@/types';

interface TransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetDepartment: Department, targetBedId: string) => void;
  patientName: string;
  availableBeds: { id: string; name: string; department: Department }[];
  currentDepartment: Department;
}

const TransferForm: React.FC<TransferFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  patientName,
  availableBeds,
  currentDepartment
}) => {
  const [selectedBedId, setSelectedBedId] = useState('');

  const handleSubmit = () => {
    if (selectedBedId) {
      const selectedBed = availableBeds.find(bed => bed.id === selectedBedId);
      if (selectedBed) {
        onSubmit(selectedBed.department, selectedBedId);
        setSelectedBedId('');
        onClose();
      }
    }
  };

  const departmentBeds = availableBeds.filter(bed => bed.department !== currentDepartment);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Paciente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Paciente:</strong> {patientName}</p>
          <p><strong>Departamento Atual:</strong> {currentDepartment}</p>
          
          <div>
            <Label>Selecionar Novo Leito:</Label>
            <Select value={selectedBedId} onValueChange={setSelectedBedId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um leito disponível" />
              </SelectTrigger>
              <SelectContent>
                {departmentBeds.map((bed) => (
                  <SelectItem key={bed.id} value={bed.id}>
                    {bed.department} - {bed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!selectedBedId} className="flex-1">
              Confirmar Transferência
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

export default TransferForm;
