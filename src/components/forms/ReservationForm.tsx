
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    patientName: string;
    originClinic: string;
    diagnosis: string;
  }) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [patientName, setPatientName] = useState('');
  const [originClinic, setOriginClinic] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleSubmit = () => {
    if (patientName && originClinic && diagnosis) {
      onSubmit({ patientName, originClinic, diagnosis });
      setPatientName('');
      setOriginClinic('');
      setDiagnosis('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reservar Leito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Digite o nome do paciente"
            />
          </div>
          <div>
            <Label htmlFor="originClinic">Clínica de Origem</Label>
            <Input
              id="originClinic"
              value={originClinic}
              onChange={(e) => setOriginClinic(e.target.value)}
              placeholder="Digite a clínica de origem"
            />
          </div>
          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Digite o diagnóstico"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Reservar
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

export default ReservationForm;
