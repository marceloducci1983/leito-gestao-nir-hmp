
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Department } from '@/types';

interface SectorManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
}

const SectorManagementModal: React.FC<SectorManagementModalProps> = ({
  isOpen,
  onClose,
  departments
}) => {
  const [newSectorName, setNewSectorName] = useState('');
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [editSectorName, setEditSectorName] = useState('');
  const { toast } = useToast();

  const handleAddSector = () => {
    if (!newSectorName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria implementada a lógica para adicionar setor
    toast({
      title: "Setor adicionado",
      description: `Setor "${newSectorName}" criado com sucesso`,
    });
    setNewSectorName('');
  };

  const handleEditSector = (sector: Department) => {
    setEditingSector(sector);
    setEditSectorName(sector);
  };

  const handleSaveEdit = () => {
    if (!editSectorName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do setor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria implementada a lógica para editar setor
    toast({
      title: "Setor editado",
      description: `Setor atualizado para "${editSectorName}"`,
    });
    setEditingSector(null);
    setEditSectorName('');
  };

  const handleDeleteSector = (sector: Department) => {
    // Aqui seria implementada a lógica para deletar setor
    toast({
      title: "Setor removido",
      description: `Setor "${sector}" removido com sucesso`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Setores/Departamentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar novo setor */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar Novo Setor</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="new-sector">Nome do Setor</Label>
                <Input
                  id="new-sector"
                  value={newSectorName}
                  onChange={(e) => setNewSectorName(e.target.value)}
                  placeholder="Ex: ORTOPEDIA"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddSector}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de setores existentes */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Setores Existentes</h3>
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingSector === dept ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editSectorName}
                        onChange={(e) => setEditSectorName(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSaveEdit}>
                        Salvar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingSector(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{dept}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditSector(dept)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteSector(dept)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectorManagementModal;
