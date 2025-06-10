
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBed, useUpdateBed } from '@/hooks/mutations/useBedMutations';
import { Department } from '@/types';

interface BedManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  bedData?: {
    id?: string;
    name: string;
    department: Department;
  };
  isEditing?: boolean;
}

const BedManagementModal: React.FC<BedManagementModalProps> = ({
  isOpen,
  onClose,
  departments,
  bedData,
  isEditing = false
}) => {
  const [bedName, setBedName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CLINICA MEDICA');

  const createBedMutation = useCreateBed();
  const updateBedMutation = useUpdateBed();

  useEffect(() => {
    if (bedData) {
      setBedName(bedData.name);
      setSelectedDepartment(bedData.department);
    } else {
      setBedName('');
      setSelectedDepartment('CLINICA MEDICA');
    }
  }, [bedData, isOpen]);

  const handleSubmit = async () => {
    if (!bedName.trim()) {
      return;
    }

    try {
      if (isEditing && bedData?.id) {
        await updateBedMutation.mutateAsync({
          bedId: bedData.id,
          name: bedName.trim(),
          department: selectedDepartment
        });
      } else {
        await createBedMutation.mutateAsync({
          name: bedName.trim(),
          department: selectedDepartment
        });
      }

      // Reset form and close modal
      setBedName('');
      setSelectedDepartment('CLINICA MEDICA');
      onClose();
    } catch (error) {
      console.error('Erro ao processar leito:', error);
    }
  };

  const isLoading = createBedMutation.isPending || updateBedMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Leito' : 'Adicionar Novo Leito'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bed-name">Nome do Leito</Label>
            <Input
              id="bed-name"
              value={bedName}
              onChange={(e) => setBedName(e.target.value)}
              placeholder="Ex: 101A, UTI-05, etc."
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="bed-department">Setor/Departamento</Label>
            <Select 
              value={selectedDepartment} 
              onValueChange={(value) => setSelectedDepartment(value as Department)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={isLoading || !bedName.trim()}
            >
              {isLoading ? 'Processando...' : (isEditing ? 'Salvar Alterações' : 'Criar Leito')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BedManagementModal;
