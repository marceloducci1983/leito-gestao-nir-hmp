
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
  const [bedName, setBedName] = useState(bedData?.name || '');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>(
    bedData?.department || 'CLINICA MEDICA'
  );
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!bedName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do leito é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDepartment) {
      toast({
        title: "Erro",
        description: "Setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria implementada a lógica para criar/editar leito
    toast({
      title: isEditing ? "Leito editado" : "Leito criado",
      description: `Leito "${bedName}" ${isEditing ? 'editado' : 'criado'} no setor ${selectedDepartment}`,
    });

    // Resetar form
    setBedName('');
    setSelectedDepartment('CLINICA MEDICA');
    onClose();
  };

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
            />
          </div>

          <div>
            <Label htmlFor="bed-department">Setor/Departamento</Label>
            <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)}>
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
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {isEditing ? 'Salvar Alterações' : 'Criar Leito'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BedManagementModal;
