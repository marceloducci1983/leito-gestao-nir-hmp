
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Patient } from '@/types';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: Omit<Patient, 'id' | 'occupationDays'>) => void;
  patient?: Patient | null;
  isEditing?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  patient = null, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sex: 'masculino' as 'masculino' | 'feminino',
    birthDate: '',
    age: 0,
    admissionDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    specialty: '',
    expectedDischargeDate: '',
    originCity: '',
    isTFD: false,
    tfdType: '',
    bedId: '',
    department: '',
    hasNoExpectedDate: false
  });

  useEffect(() => {
    if (patient && isEditing) {
      const hasNoExpectedDate = !patient.expectedDischargeDate || patient.expectedDischargeDate === '';
      setFormData({
        name: patient.name,
        sex: patient.sex,
        birthDate: patient.birthDate,
        age: patient.age,
        admissionDate: patient.admissionDate,
        diagnosis: patient.diagnosis,
        specialty: patient.specialty || '',
        expectedDischargeDate: hasNoExpectedDate ? '' : patient.expectedDischargeDate,
        originCity: patient.originCity,
        isTFD: patient.isTFD,
        tfdType: patient.tfdType || '',
        bedId: patient.bedId,
        department: patient.department,
        hasNoExpectedDate: hasNoExpectedDate
      });
    } else if (!isEditing) {
      setFormData({
        name: '',
        sex: 'masculino',
        birthDate: '',
        age: 0,
        admissionDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        specialty: '',
        expectedDischargeDate: '',
        originCity: '',
        isTFD: false,
        tfdType: '',
        bedId: '',
        department: '',
        hasNoExpectedDate: false
      });
    }
  }, [patient, isEditing, isOpen]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      birthDate: date,
      age: date ? calculateAge(date) : 0
    }));
  };

  const handleSubmit = () => {
    const isValidDate = formData.hasNoExpectedDate || formData.expectedDischargeDate;
    if (formData.name && formData.birthDate && formData.diagnosis && isValidDate) {
      const submissionData = {
        ...formData,
        age: calculateAge(formData.birthDate),
        expectedDischargeDate: formData.hasNoExpectedDate ? '' : formData.expectedDischargeDate
      };
      // Remove hasNoExpectedDate before submitting
      const { hasNoExpectedDate, ...dataToSubmit } = submissionData;
      onSubmit(dataToSubmit);
      onClose();
    }
  };

  const handleNoExpectedDateChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasNoExpectedDate: checked,
      expectedDischargeDate: checked ? '' : prev.expectedDischargeDate
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Paciente' : 'Admitir Paciente'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Paciente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="sex">Sexo</Label>
              <Select value={formData.sex} onValueChange={(value: 'masculino' | 'feminino') => 
                setFormData(prev => ({ ...prev, sex: value }))}>
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
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                value={formData.age}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admissionDate">Data de Admissão</Label>
              <Input
                id="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
              />
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="expectedDischargeDate">Data Provável de Alta</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasNoExpectedDate"
                      checked={formData.hasNoExpectedDate}
                      onCheckedChange={handleNoExpectedDateChange}
                    />
                    <Label htmlFor="hasNoExpectedDate" className="text-sm text-muted-foreground">
                      SEM DATA PREVISTA
                    </Label>
                  </div>
                </div>
                <Input
                  id="expectedDischargeDate"
                  type="date"
                  value={formData.expectedDischargeDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedDischargeDate: e.target.value }))}
                  disabled={formData.hasNoExpectedDate}
                  className={formData.hasNoExpectedDate ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="Digite o diagnóstico"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">Especialidade</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                placeholder="Especialidade médica"
              />
            </div>
            <div>
              <Label htmlFor="originCity">Município de Origem</Label>
              <Input
                id="originCity"
                value={formData.originCity}
                onChange={(e) => setFormData(prev => ({ ...prev, originCity: e.target.value }))}
                placeholder="Cidade de origem"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isTFD"
                checked={formData.isTFD}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTFD: !!checked }))}
              />
              <Label htmlFor="isTFD">TFD (Tratamento Fora do Domicílio)</Label>
            </div>
            {formData.isTFD && (
              <div>
                <Label htmlFor="tfdType">Tipo de TFD</Label>
                <Input
                  id="tfdType"
                  value={formData.tfdType}
                  onChange={(e) => setFormData(prev => ({ ...prev, tfdType: e.target.value }))}
                  placeholder="Especifique o tipo de TFD"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              {isEditing ? 'Salvar Alterações' : 'Admitir Paciente'}
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

export default PatientForm;
