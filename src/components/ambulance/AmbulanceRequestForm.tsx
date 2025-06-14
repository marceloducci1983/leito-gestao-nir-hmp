
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateAmbulanceRequest } from '@/hooks/mutations/useAmbulanceMutations';
import CityAutocomplete from './CityAutocomplete';

interface AmbulanceRequestFormProps {
  open: boolean;
  onClose: () => void;
}

const AmbulanceRequestForm: React.FC<AmbulanceRequestFormProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    sector: '',
    bed: '',
    is_puerpera: false,
    appropriate_crib: false,
    mobility: 'DEITADO' as 'DEITADO' | 'SENTADO',
    vehicle_type: 'AMBULANCIA' as 'AMBULANCIA' | 'CARRO_COMUM',
    vehicle_subtype: 'BASICA' as 'BASICA' | 'AVANCADA' | undefined,
    origin_city: ''
  });

  const createMutation = useCreateAmbulanceRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_name.trim()) {
      alert('Nome do paciente é obrigatório');
      return;
    }
    
    if (!formData.sector.trim()) {
      alert('Setor é obrigatório');
      return;
    }
    
    if (!formData.bed.trim()) {
      alert('Leito é obrigatório');
      return;
    }
    
    if (!formData.origin_city.trim()) {
      alert('Cidade de origem é obrigatória');
      return;
    }

    const submitData = {
      ...formData,
      appropriate_crib: formData.is_puerpera ? formData.appropriate_crib : undefined,
      vehicle_subtype: formData.vehicle_type === 'AMBULANCIA' ? formData.vehicle_subtype : undefined
    };

    createMutation.mutate(submitData, {
      onSuccess: () => {
        setFormData({
          patient_name: '',
          sector: '',
          bed: '',
          is_puerpera: false,
          appropriate_crib: false,
          mobility: 'DEITADO',
          vehicle_type: 'AMBULANCIA',
          vehicle_subtype: 'BASICA',
          origin_city: ''
        });
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Ambulância</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient_name">Nome do Paciente *</Label>
            <Input
              id="patient_name"
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              placeholder="Digite o nome completo do paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="sector">Setor *</Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              placeholder="Digite o setor (ex: Clínica Médica, UTI, etc.)"
              required
            />
          </div>

          <div>
            <Label htmlFor="bed">Leito *</Label>
            <Input
              id="bed"
              value={formData.bed}
              onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
              placeholder="Digite o número do leito (ex: 12A, Box-3, etc.)"
              required
            />
          </div>

          <div>
            <Label>Cidade de Origem *</Label>
            <CityAutocomplete
              value={formData.origin_city}
              onChange={(value) => setFormData({ ...formData, origin_city: value })}
              placeholder="Digite o nome da cidade..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_puerpera"
              checked={formData.is_puerpera}
              onCheckedChange={(checked) => 
                setFormData({ 
                  ...formData, 
                  is_puerpera: checked as boolean,
                  appropriate_crib: false 
                })
              }
            />
            <Label htmlFor="is_puerpera">Puérpera</Label>
          </div>

          {formData.is_puerpera && (
            <div className="flex items-center space-x-2 ml-6">
              <Checkbox
                id="appropriate_crib"
                checked={formData.appropriate_crib}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, appropriate_crib: checked as boolean })
                }
              />
              <Label htmlFor="appropriate_crib">Berço apropriado</Label>
            </div>
          )}

          <div>
            <Label>Mobilidade</Label>
            <RadioGroup
              value={formData.mobility}
              onValueChange={(value) => setFormData({ ...formData, mobility: value as 'DEITADO' | 'SENTADO' })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DEITADO" id="deitado" />
                <Label htmlFor="deitado">Deitado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SENTADO" id="sentado" />
                <Label htmlFor="sentado">Sentado</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Tipo de Veículo</Label>
            <RadioGroup
              value={formData.vehicle_type}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                vehicle_type: value as 'AMBULANCIA' | 'CARRO_COMUM',
                vehicle_subtype: value === 'AMBULANCIA' ? 'BASICA' : undefined
              })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AMBULANCIA" id="ambulancia" />
                <Label htmlFor="ambulancia">Ambulância</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CARRO_COMUM" id="carro_comum" />
                <Label htmlFor="carro_comum">Carro Comum</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.vehicle_type === 'AMBULANCIA' && (
            <div>
              <Label>Tipo de Ambulância</Label>
              <RadioGroup
                value={formData.vehicle_subtype}
                onValueChange={(value) => setFormData({ ...formData, vehicle_subtype: value as 'BASICA' | 'AVANCADA' })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BASICA" id="basica" />
                  <Label htmlFor="basica">Básica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="AVANCADA" id="avancada" />
                  <Label htmlFor="avancada">Avançada</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Criando...' : 'Criar Solicitação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AmbulanceRequestForm;
