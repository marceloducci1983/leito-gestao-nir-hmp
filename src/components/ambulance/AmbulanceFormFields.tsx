import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import CityAutocomplete from './CityAutocomplete';
import { AmbulanceFormData } from './AmbulanceFormTypes';
import { getCurrentDateSaoPaulo, getCurrentTimeSaoPaulo } from '@/utils/timezoneUtils';

interface AmbulanceFormFieldsProps {
  formData: AmbulanceFormData;
  setFormData: (data: AmbulanceFormData) => void;
}

const AmbulanceFormFields: React.FC<AmbulanceFormFieldsProps> = ({ formData, setFormData }) => {
  // Preencher automaticamente data e hora quando o componente for montado
  useEffect(() => {
    if (!formData.request_date || !formData.request_time) {
      const currentDate = getCurrentDateSaoPaulo();
      const currentTime = getCurrentTimeSaoPaulo();
      
      setFormData({
        ...formData,
        request_date: currentDate,
        request_time: currentTime
      });
    }
  }, []);

  return (
    <div className="space-y-4">
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
        <Label htmlFor="contact">Contato</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          placeholder="Digite o telefone ou outro contato (ex: (31) 99999-9999)"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="request_date">Data da Solicitação *</Label>
          <Input
            id="request_date"
            type="date"
            value={formData.request_date}
            onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="request_time">Hora da Solicitação *</Label>
          <Input
            id="request_time"
            type="time"
            value={formData.request_time}
            onChange={(e) => setFormData({ ...formData, request_time: e.target.value })}
            required
          />
        </div>
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
    </div>
  );
};

export default AmbulanceFormFields;
