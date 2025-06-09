
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface InvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  action: 'investigated' | 'not_investigated';
}

const InvestigationModal: React.FC<InvestigationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  action
}) => {
  const isInvestigated = action === 'investigated';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isInvestigated ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            Confirmar {isInvestigated ? 'Investigação' : 'Não Investigação'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Confirma que o caso de reinternação do paciente <strong>{patientName}</strong> foi{' '}
            <strong>{isInvestigated ? 'INVESTIGADO' : 'NÃO INVESTIGADO'}</strong>?
          </p>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant={isInvestigated ? 'default' : 'destructive'}
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestigationModal;
