import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Patient } from '@/types';
import { calculateAge, isValidDate, convertDateToISO, convertISOToDisplayDate, formatAgeForDepartment } from '@/utils/dateUtils';

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
    name: '',
    sex: 'masculino' as 'masculino' | 'feminino',
    birthDate: '',
    age: 0,
    admissionDate: new Date().toISOString().split('T')[0],
    admissionTime: new Date().toTimeString().slice(0, 5),
    diagnosis: '',
    specialty: '',
    expectedDischargeDate: '',
    originCity: '',
    isTFD: false,
    tfdType: '',
    department: department || 'CLINICA MEDICA',
    hasNoExpectedDate: false
  });

  // Initialize form data when patient data changes
  useEffect(() => {
    if (currentPatient) {
      const hasNoExpectedDate = !currentPatient.expectedDischargeDate || currentPatient.expectedDischargeDate === '';
      setFormData({
        name: currentPatient.name || '',
        sex: currentPatient.sex || 'masculino',
        birthDate: currentPatient.birthDate ? convertISOToDisplayDate(currentPatient.birthDate) : '',
        age: currentPatient.age || 0,
        admissionDate: currentPatient.admissionDate || new Date().toISOString().split('T')[0],
        admissionTime: currentPatient.admissionTime || new Date().toTimeString().slice(0, 5),
        diagnosis: currentPatient.diagnosis || '',
        specialty: currentPatient.specialty || '',
        expectedDischargeDate: hasNoExpectedDate ? '' : currentPatient.expectedDischargeDate || '',
        originCity: currentPatient.originCity || '',
        isTFD: currentPatient.isTFD || false,
        tfdType: currentPatient.tfdType || '',
        department: currentPatient.department || department || 'CLINICA MEDICA',
        hasNoExpectedDate: hasNoExpectedDate
      });
    } else if (!isEditing) {
      // Reset form for new patient
      setFormData({
        name: '',
        sex: 'masculino',
        birthDate: '',
        age: 0,
        admissionDate: new Date().toISOString().split('T')[0],
        admissionTime: new Date().toTimeString().slice(0, 5),
        diagnosis: '',
        specialty: '',
        expectedDischargeDate: '',
        originCity: '',
        isTFD: false,
        tfdType: '',
        department: department || 'CLINICA MEDICA',
        hasNoExpectedDate: false
      });
    }
  }, [currentPatient, isEditing, department]);

  // Calculate age automatically when birth date changes
  useEffect(() => {
    if (formData.birthDate && isValidDate(formData.birthDate)) {
      let calculatedAge = calculateAge(formData.birthDate);
      
      // Para UTI NEONATAL e PEDIATRIA, usar idade específica se necessário
      if (formData.department === 'UTI NEONATAL' || formData.department === 'PEDIATRIA') {
        const ageInDays = Math.floor((new Date().getTime() - new Date(formData.birthDate.split('/').reverse().join('-')).getTime()) / (1000 * 60 * 60 * 24));
        const ageInMonths = Math.floor(ageInDays / 30.44); // Média de dias por mês
        
        if (ageInDays <= 30) {
          calculatedAge = ageInDays; // Salvar em dias
        } else if (ageInMonths < 24) {
          calculatedAge = ageInMonths; // Salvar em meses
        }
      }
      
      setFormData(prev => ({ ...prev, age: calculatedAge }));
    }
  }, [formData.birthDate, formData.department]);

  const handleBirthDateChange = (value: string) => {
    // Allow typing and format validation
    setFormData(prev => ({ ...prev, birthDate: value }));
  };

  const handleNoExpectedDateChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasNoExpectedDate: checked,
      expectedDischargeDate: checked ? '' : prev.expectedDischargeDate
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    if (!formData.diagnosis.trim()) {
      alert('Diagnóstico é obrigatório');
      return;
    }
    
    if (!formData.originCity.trim()) {
      alert('Município de origem é obrigatório');
      return;
    }
    
    if (!isValidDate(formData.birthDate)) {
      alert('Data de nascimento inválida. Use o formato DD/MM/AAAA');
      return;
    }

    console.log('🔄 NewPatientForm - Form data before submission:', {
      formData,
      isTFD: formData.isTFD,
      tfdType: formData.tfdType,
      name: formData.name
    });
    
    // Convert birth date to ISO format for database
    const birthDateISO = convertDateToISO(formData.birthDate);
    
    const patientData = {
      name: formData.name.trim(),
      sex: formData.sex,
      birthDate: birthDateISO,
      age: formData.age,
      admissionDate: formData.admissionDate,
      admissionTime: formData.admissionTime,
      diagnosis: formData.diagnosis.trim(),
      specialty: formData.specialty.trim(),
      expectedDischargeDate: formData.hasNoExpectedDate ? '' : (formData.expectedDischargeDate || formData.admissionDate),
      originCity: formData.originCity.trim(),
      isTFD: formData.isTFD,
      tfdType: formData.tfdType.trim(),
      department: formData.department,
      occupationDays: 0
    };

    console.log('🔄 NewPatientForm - Patient data being submitted:', {
      patientData,
      isTFD: patientData.isTFD,
      tfdType: patientData.tfdType,
      name: patientData.name
    });
    onSubmit(patientData);
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

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
                placeholder="Digite o nome completo"
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
              <Label htmlFor="birthDate">Data de Nascimento * (DD/MM/AAAA)</Label>
              <Input
                id="birthDate"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formData.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                required
              />
              {formData.birthDate && !isValidDate(formData.birthDate) && (
                <p className="text-sm text-red-600 mt-1">Formato inválido. Use DD/MM/AAAA</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Idade (calculada automaticamente)</Label>
              <Input
                id="age"
                type="text"
                value={formData.birthDate && isValidDate(formData.birthDate) ? formatAgeForDepartment(formData.birthDate, formData.department) : ''}
                readOnly
                className="bg-gray-100"
                placeholder="Calculada automaticamente"
              />
              {formData.birthDate && isValidDate(formData.birthDate) && (
                <p className="text-sm text-green-600 mt-1">
                  IDADE: {formatAgeForDepartment(formData.birthDate, formData.department)}
                </p>
              )}
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
              placeholder="Digite o diagnóstico do paciente"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">Especialidade</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="Digite a especialidade"
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
                  onChange={(e) => setFormData({ ...formData, expectedDischargeDate: e.target.value })}
                  min={today}
                  disabled={formData.hasNoExpectedDate}
                  className={formData.hasNoExpectedDate ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="originCity">Município de Origem *</Label>
            <Input
              id="originCity"
              value={formData.originCity}
              onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
              required
              placeholder="Digite o município de origem"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isTFD"
                checked={formData.isTFD}
                onCheckedChange={(checked) => setFormData({ ...formData, isTFD: checked, tfdType: checked ? formData.tfdType : '' })}
              />
              <Label htmlFor="isTFD">Paciente TFD</Label>
            </div>

            {formData.isTFD && (
              <div>
                <Label htmlFor="tfdType">Tipo de TFD</Label>
                <Input
                  id="tfdType"
                  placeholder="Digite o tipo de TFD"
                  value={formData.tfdType}
                  onChange={(e) => setFormData({ ...formData, tfdType: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name || !formData.diagnosis || !formData.originCity || !isValidDate(formData.birthDate)}
            >
              {isEditing ? 'Salvar Alterações' : 'Admitir Paciente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientForm;
