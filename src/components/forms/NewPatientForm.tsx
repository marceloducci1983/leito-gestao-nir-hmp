
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientData: any) => void;
  bedId: string;
  department: string;
  isEditing?: boolean;
  patientData?: any;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bedId,
  department,
  isEditing = false,
  patientData
}) => {
  const [formData, setFormData] = useState({
    name: patientData?.name || '',
    sex: patientData?.sex || '',
    birth_date: patientData?.birth_date ? new Date(patientData.birth_date) : null,
    age: patientData?.age || '',
    admission_date: patientData?.admission_date ? new Date(patientData.admission_date) : new Date(),
    diagnosis: patientData?.diagnosis || '',
    specialty: patientData?.specialty || '',
    expected_discharge_date: patientData?.expected_discharge_date ? new Date(patientData.expected_discharge_date) : null,
    origin_city: patientData?.origin_city || '',
    is_tfd: patientData?.is_tfd || false,
    tfd_type: patientData?.tfd_type || ''
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleBirthDateChange = (date: Date | undefined) => {
    if (date) {
      const age = calculateAge(date);
      setFormData(prev => ({
        ...prev,
        birth_date: date,
        age: age.toString()
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      sex: formData.sex,
      birth_date: formData.birth_date ? format(formData.birth_date, 'yyyy-MM-dd') : '',
      age: parseInt(formData.age),
      admission_date: format(formData.admission_date, 'yyyy-MM-dd'),
      diagnosis: formData.diagnosis,
      specialty: formData.specialty,
      expected_discharge_date: formData.expected_discharge_date ? format(formData.expected_discharge_date, 'yyyy-MM-dd') : '',
      origin_city: formData.origin_city,
      is_tfd: formData.is_tfd,
      tfd_type: formData.is_tfd ? formData.tfd_type : null,
      bed_id: bedId,
      department: department,
      occupation_days: 0
    };

    onSubmit(submitData);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sex: '',
      birth_date: null,
      age: '',
      admission_date: new Date(),
      diagnosis: '',
      specialty: '',
      expected_discharge_date: null,
      origin_city: '',
      is_tfd: false,
      tfd_type: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Paciente' : 'Admitir Paciente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Paciente*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="sex">Sexo*</Label>
              <Select value={formData.sex} onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
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
              <Label>Data de Nascimento*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.birth_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birth_date ? format(formData.birth_date, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.birth_date}
                    onSelect={handleBirthDateChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
              <Label>Data de Admissão*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.admission_date, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.admission_date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, admission_date: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data Provável de Alta*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expected_discharge_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expected_discharge_date ? format(formData.expected_discharge_date, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expected_discharge_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, expected_discharge_date: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnóstico*</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="specialty">Especialidade</Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="origin_city">Município de Origem*</Label>
            <Input
              id="origin_city"
              value={formData.origin_city}
              onChange={(e) => setFormData(prev => ({ ...prev, origin_city: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_tfd"
                checked={formData.is_tfd}
                onChange={(e) => setFormData(prev => ({ ...prev, is_tfd: e.target.checked, tfd_type: e.target.checked ? prev.tfd_type : '' }))}
              />
              <Label htmlFor="is_tfd">TFD (Tratamento Fora de Domicílio)</Label>
            </div>

            {formData.is_tfd && (
              <div>
                <Label htmlFor="tfd_type">Tipo de TFD</Label>
                <Input
                  id="tfd_type"
                  value={formData.tfd_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, tfd_type: e.target.value }))}
                  placeholder="Digite o tipo de TFD"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
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
