
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BedManagementActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  bedName: string;
  selectedDepartment: string;
  isEditing: boolean;
}

export const BedManagementActions: React.FC<BedManagementActionsProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  bedName,
  selectedDepartment,
  isEditing
}) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button 
        variant="outline" 
        onClick={onCancel} 
        className="flex-1"
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit} 
        className="flex-1"
        disabled={isLoading || !bedName.trim() || !selectedDepartment}
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          isEditing ? 'Salvar Alterações' : 'Criar Leito'
        )}
      </Button>
    </div>
  );
};
