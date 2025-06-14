
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAmbulanceRequest } from '@/hooks/mutations/useAmbulanceMutations';
import CityAutocomplete from './CityAutocomplete';

interface AmbulanceRequestFormProps {
  open: boolean;
  onClose: () => void;
}

const AmbulanceRequestForm: React.FC<AmbulanceRequestFormProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    is_puerpera: false,
    appropriate_crib: undefined as boolean | undefined,
    mobility: '' as 'DEITADO' | 'SENTADO' | '',
    vehicle_type: '' as 'AMBULANCIA' | 'CARRO_COMUM' | '',
    vehicle_subtype: undefined as 'BASICA' | 'AVANCADA' | undefined,
    origin_city: ''
  });

  const createMutation = useCreateAmbulanceRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_name || !formData.mobility || !formData.vehicle_type || !formData.origin_city) {
      return;
    }

    const submitData = {
      ...formData,
      mobility: formData.mobility as 'DEITADO' | 'SENTADO',
      vehicle_type: formData.vehicle_type as 'AMBULANCIA' | 'CARRO_COMUM'
    };

    createMutation.mutate(submitData, {
      onSuccess: () => {
        onClose();
        setFormData({
          patient_name: '',
          is_puerpera: false,
          appropriate_crib: undefined,
          mobility: '',
          vehicle_type: '',
          vehicle_subtype: undefined,
          origin_city: ''
        });
      }
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Ambulância</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patient_name">Nome do Paciente *</Label>
            <Input
              id="patient_name"
              value={formData.patient_name}
              onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Puérpera *</Label>
            <RadioGroup
              value={formData.is_puerpera ? 'sim' : 'nao'}
              onValueChange={(value) => {
                const isPuerpera = value === 'sim';
                setFormData(prev => ({
                  ...prev,
                  is_puerpera: isPuerpera,
                  appropriate_crib: isPuerpera ? undefined : undefined
                }));
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="puerpera_sim" />
                <Label htmlFor="puerpera_sim">SIM</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="puerpera_nao" />
                <Label htmlFor="puerpera_nao">NÃO</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.is_puerpera && (
            <div className="space-y-3">
              <Label>Berço apropriado para idade? *</Label>
              <RadioGroup
                value={formData.appropriate_crib === true ? 'sim' : formData.appropriate_crib === false ? 'nao' : ''}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, appropriate_crib: value === 'sim' }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="berco_sim" />
                  <Label htmlFor="berco_sim">SIM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="berco_nao" />
                  <Label htmlFor="berco_nao">NÃO</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-3">
            <Label>Mobilidade *</Label>
            <RadioGroup
              value={formData.mobility}
              onValueChange={(value) => setFormData(prev => ({ ...prev, mobility: value as 'DEITADO' | 'SENTADO' }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DEITADO" id="deitado" />
                <Label htmlFor="deitado">DEITADO</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SENTADO" id="sentado" />
                <Label htmlFor="sentado">SENTADO</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="vehicle_type">Veículo *</Label>
            <Select
              value={formData.vehicle_type}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                vehicle_type: value as 'AMBULANCIA' | 'CARRO_COMUM',
                vehicle_subtype: value === 'CARRO_COMUM' ? undefined : prev.vehicle_subtype
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AMBULANCIA">Ambulância</SelectItem>
                <SelectItem value="CARRO_COMUM">Carro comum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.vehicle_type === 'AMBULANCIA' && (
            <div className="space-y-3">
              <Label htmlFor="vehicle_subtype">Tipo de Ambulância *</Label>
              <Select
                value={formData.vehicle_subtype || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_subtype: value as 'BASICA' | 'AVANCADA' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de ambulância" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASICA">BÁSICA</SelectItem>
                  <SelectItem value="AVANCADA">AVANÇADA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="origin_city">Cidade de Origem *</Label>
            <CityAutocomplete
              value={formData.origin_city}
              onChange={(value) => setFormData(prev => ({ ...prev, origin_city: value }))}
              placeholder="Digite o nome da cidade de MG..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input value={date} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Hora</Label>
              <Input value={time} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              CANCELAR SOLICITAÇÃO
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending ? 'Criando...' : 'CONFIRMAR SOLICITAÇÃO'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AmbulanceRequestForm;
