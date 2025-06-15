
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBed, useUpdateBed } from '@/hooks/mutations/useBedMutations';
import { useDepartmentNames } from '@/hooks/queries/useDepartmentQueries';
import { RefreshCw } from 'lucide-react';

interface BedManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  bedData?: {
    id?: string;
    name: string;
    department: string;
  };
  isEditing?: boolean;
}

const BedManagementModal: React.FC<BedManagementModalProps> = ({
  isOpen,
  onClose,
  departments: fallbackDepartments,
  bedData,
  isEditing = false
}) => {
  const [bedName, setBedName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('CLINICA MEDICA');

  const { departmentNames, isLoading: loadingDepartments, refetch: refetchDepartments } = useDepartmentNames();
  const createBedMutation = useCreateBed();
  const updateBedMutation = useUpdateBed();

  // Usar departamentos dinâmicos do banco de dados sempre que disponível
  const departments = departmentNames.length > 0 ? departmentNames : fallbackDepartments;

  // Função para atualizar lista de departamentos
  const handleRefreshDepartments = async () => {
    console.log('🔄 Atualizando lista de departamentos...');
    await refetchDepartments();
  };

  useEffect(() => {
    if (bedData && isOpen) {
      setBedName(bedData.name);
      setSelectedDepartment(bedData.department);
    } else if (isOpen) {
      setBedName('');
      // Usar o primeiro departamento disponível ou fallback
      const defaultDept = departments.length > 0 ? departments[0] : 'CLINICA MEDICA';
      setSelectedDepartment(defaultDept);
    }
  }, [bedData, isOpen, departments]);

  // Atualizar departamentos quando o modal abrir
  useEffect(() => {
    if (isOpen && !loadingDepartments) {
      handleRefreshDepartments();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!bedName.trim()) {
      console.log('Nome do leito é obrigatório');
      return;
    }

    if (!selectedDepartment) {
      console.log('Setor é obrigatório');
      return;
    }

    console.log('📝 Submetendo leito:', { 
      bedName: bedName.trim(), 
      selectedDepartment, 
      isEditing 
    });

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
      const defaultDept = departments.length > 0 ? departments[0] : 'CLINICA MEDICA';
      setSelectedDepartment(defaultDept);
      onClose();
    } catch (error) {
      console.error('❌ Erro ao processar leito:', error);
    }
  };

  const isLoading = createBedMutation.isPending || updateBedMutation.isPending || loadingDepartments;

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
            <div className="flex gap-2">
              <Select 
                value={selectedDepartment} 
                onValueChange={(value) => setSelectedDepartment(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="flex-1">
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
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRefreshDepartments}
                disabled={isLoading}
                title="Atualizar lista de setores"
              >
                <RefreshCw className={`h-4 w-4 ${loadingDepartments ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {departments.length} setores disponíveis
              {departmentNames.length > 0 && ' (atualizados do banco)'}
            </p>
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
              disabled={isLoading || !bedName.trim() || !selectedDepartment}
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
