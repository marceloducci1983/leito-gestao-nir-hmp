
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NewReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservationData: any) => void;
  bedId: string;
  department: string;
}

const NewReservationForm: React.FC<NewReservationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bedId,
  department
}) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    origin_clinic: '',
    diagnosis: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.patient_name.trim()) {
      alert('Nome do paciente é obrigatório');
      return;
    }
    
    if (!formData.origin_clinic.trim()) {
      alert('Clínica de origem é obrigatória');
      return;
    }
    
    if (!formData.diagnosis.trim()) {
      alert('Diagnóstico é obrigatório');
      return;
    }
    
    console.log('Reservation form data:', formData);
    
    // Submit with correct property names
    const submitData = {
      patient_name: formData.patient_name.trim(),
      origin_clinic: formData.origin_clinic.trim(),
      diagnosis: formData.diagnosis.trim()
    };

    console.log('Submitting reservation data:', submitData);
    onSubmit(submitData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patient_name: '',
      origin_clinic: '',
      diagnosis: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar Leito</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient_name">Nome do Paciente *</Label>
            <Input
              id="patient_name"
              value={formData.patient_name}
              onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
              required
              placeholder="Digite o nome do paciente"
            />
          </div>

          <div>
            <Label htmlFor="origin_clinic">Clínica de Origem *</Label>
            <Input
              id="origin_clinic"
              value={formData.origin_clinic}
              onChange={(e) => setFormData(prev => ({ ...prev, origin_clinic: e.target.value }))}
              required
              placeholder="Digite a clínica de origem"
            />
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              required
              placeholder="Digite o diagnóstico"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.patient_name || !formData.origin_clinic || !formData.diagnosis}
            >
              Reservar Leito
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewReservationForm;
