
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AmbulanceFormFields from './AmbulanceFormFields';
import AmbulanceFormActions from './AmbulanceFormActions';
import { AmbulanceFormData, initialFormData } from './AmbulanceFormTypes';

interface AmbulanceRequestFormProps {
  open: boolean;
  onClose: () => void;
}

const AmbulanceRequestForm: React.FC<AmbulanceRequestFormProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<AmbulanceFormData>(initialFormData);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Ambulância</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <AmbulanceFormFields 
            formData={formData} 
            setFormData={setFormData} 
          />
          
          <AmbulanceFormActions 
            formData={formData} 
            setFormData={setFormData} 
            onClose={onClose} 
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AmbulanceRequestForm;
