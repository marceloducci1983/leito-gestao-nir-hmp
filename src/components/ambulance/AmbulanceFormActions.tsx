
import React from 'react';
import { Button } from '@/components/ui/button';
import { AmbulanceFormData, initialFormData } from './AmbulanceFormTypes';
import { useCreateAmbulanceRequest } from '@/hooks/mutations/useAmbulanceMutations';

interface AmbulanceFormActionsProps {
  formData: AmbulanceFormData;
  setFormData: (data: AmbulanceFormData) => void;
  onClose: () => void;
}

export const useAmbulanceFormValidation = () => {
  const validateForm = (formData: AmbulanceFormData): boolean => {
    if (!formData.patient_name.trim()) {
      alert('Nome do paciente é obrigatório');
      return false;
    }
    
    if (!formData.sector.trim()) {
      alert('Setor é obrigatório');
      return false;
    }
    
    if (!formData.bed.trim()) {
      alert('Leito é obrigatório');
      return false;
    }
    
    if (!formData.origin_city.trim()) {
      alert('Cidade de origem é obrigatória');
      return false;
    }

    return true;
  };

  return { validateForm };
};

const AmbulanceFormActions: React.FC<AmbulanceFormActionsProps> = ({ 
  formData, 
  setFormData, 
  onClose 
}) => {
  const createMutation = useCreateAmbulanceRequest();
  const { validateForm } = useAmbulanceFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    const submitData = {
      ...formData,
      appropriate_crib: formData.is_puerpera ? formData.appropriate_crib : undefined,
      vehicle_subtype: formData.vehicle_type === 'AMBULANCIA' ? formData.vehicle_subtype : undefined
    };

    createMutation.mutate(submitData, {
      onSuccess: () => {
        setFormData(initialFormData);
        onClose();
      }
    });
  };

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button type="submit" disabled={createMutation.isPending} onClick={handleSubmit}>
        {createMutation.isPending ? 'Criando...' : 'Criar Solicitação'}
      </Button>
    </div>
  );
};

export default AmbulanceFormActions;
