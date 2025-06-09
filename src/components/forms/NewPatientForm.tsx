
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Patient } from '@/types';

interface NewPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientData: Omit<Patient, 'id' | 'bedId' | 'occupationDays'>) => void;
  bedId?: string;
  department?: string;
  patient?: Patient | null;
  patientData?: Patient | null;
  isEditing?: boolean;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bedId,
  department,
  patient,
  patientData,
  isEditing = false
}) => {
  const currentPatient = patient || patientData;
  
  const [formData, setFormData] = useState({
    name: currentPatient?.name || '',
    sex: currentPatient?.sex || 'masculino' as 'masculino' | 'feminino',
    birthDate: currentPatient?.birthDate || '',
    age: currentPatient?.age || 0,
    admissionDate: currentPatient?.admissionDate || new Date().toISOString().split('T')[0],
    admissionTime: currentPatient?.admissionTime || new Date().toTimeString().slice(0, 5),
    diagnosis: currentPatient?.diagnosis || '',
    specialty: currentPatient?.specialty || '',
    expectedDischargeDate: currentPatient?.expectedDischargeDate || '',
    originCity: currentPatient?.originCity || '',
    isTFD: currentPatient?.isTFD || false,
    tfdType: currentPatient?.tfdType || '',
    department: currentPatient?.department || department || 'CLINICA MEDICA'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patientData = {
      name: formData.name,
      sex: formData.sex,
      birthDate: formData.birthDate,
      age: formData.age,
      admissionDate: formData.admissionDate,
      admissionTime: formData.admissionTime,
      diagnosis: formData.diagnosis,
      specialty: formData.specialty,
      expectedDischargeDate: formData.expectedDischargeDate,
      originCity: formData.originCity,
      isTFD: formData.isTFD,
      tfdType: formData.tfdType,
      department: formData.department,
      occupationDays: 0
    };

    onSubmit(patientData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Paciente' : 'Admitir Paciente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="sex">Sexo *</Label>
              <Select value={formData.sex} onValueChange={(value: 'masculino' | 'feminino') => setFormData({ ...formData, sex: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Input
                id="birthDate"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Idade *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admissionDate">Data de Admissão *</Label>
              <Input
                id="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="admissionTime">Hora de Admissão *</Label>
              <Input
                id="admissionTime"
                type="time"
                value={formData.admissionTime}
                onChange={(e) => setFormData({ ...formData, admissionTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">Especialidade</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="expectedDischargeDate">Data Provável de Alta</Label>
              <Input
                id="expectedDischargeDate"
                type="date"
                value={formData.expectedDischargeDate}
                onChange={(e) => setFormData({ ...formData, expectedDischargeDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="originCity">Município de Origem *</Label>
            <Input
              id="originCity"
              value={formData.originCity}
              onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isTFD"
                checked={formData.isTFD}
                onCheckedChange={(checked) => setFormData({ ...formData, isTFD: checked })}
              />
              <Label htmlFor="isTFD">Paciente TFD</Label>
            </div>

            {formData.isTFD && (
              <div>
                <Label htmlFor="tfdType">Tipo de TFD</Label>
                <Select value={formData.tfdType} onValueChange={(value) => setFormData({ ...formData, tfdType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de TFD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNO">TFD Interno</SelectItem>
                    <SelectItem value="EXTERNO">TFD Externo</SelectItem>
                    <SelectItem value="REGULACAO">Regulação</SelectItem>
                    <SelectItem value="URGENCIA">Urgência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Admitir Paciente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientForm;
