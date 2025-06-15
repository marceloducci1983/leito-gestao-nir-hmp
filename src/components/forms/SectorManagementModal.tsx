
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useDepartments } from '@/hooks/queries/useDepartmentQueries';
import { useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@/hooks/mutations/useDepartmentMutations';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SectorManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[]; // Mantido para compatibilidade, mas não usado
}

const SectorManagementModal: React.FC<SectorManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorDescription, setNewSectorDescription] = useState('');
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [editSectorName, setEditSectorName] = useState('');
  const [editSectorDescription, setEditSectorDescription] = useState('');

  const { data: departments = [], isLoading: loadingDepartments } = useDepartments();
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  const handleAddSector = async () => {
    if (!newSectorName.trim()) {
      return;
    }

    console.log('📝 Iniciando criação de setor:', newSectorName.trim());
    
    try {
      await createDepartmentMutation.mutateAsync({
        name: newSectorName.trim(),
        description: newSectorDescription.trim() || undefined
      });
      setNewSectorName('');
      setNewSectorDescription('');
      console.log('✅ Setor criado e formulário limpo');
    } catch (error) {
      console.error('❌ Erro na criação do setor:', error);
    }
  };

  const handleEditSector = (department: any) => {
    console.log('✏️ Editando setor:', department);
    setEditingSector(department.id);
    setEditSectorName(department.name);
    setEditSectorDescription(department.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editSectorName.trim() || !editingSector) {
      return;
    }

    console.log('💾 Salvando edição do setor:', {
      id: editingSector,
      name: editSectorName.trim()
    });

    try {
      await updateDepartmentMutation.mutateAsync({
        id: editingSector,
        name: editSectorName.trim(),
        description: editSectorDescription.trim() || undefined
      });
      setEditingSector(null);
      setEditSectorName('');
      setEditSectorDescription('');
      console.log('✅ Edição salva e formulário limpo');
    } catch (error) {
      console.error('❌ Erro na edição do setor:', error);
    }
  };

  const handleDeleteSector = async (departmentId: string) => {
    console.log('🗑️ Removendo setor:', departmentId);
    
    try {
      await deleteDepartmentMutation.mutateAsync(departmentId);
      console.log('✅ Setor removido com sucesso');
    } catch (error) {
      console.error('❌ Erro na remoção do setor:', error);
    }
  };

  const isLoading = createDepartmentMutation.isPending || 
                   updateDepartmentMutation.isPending || 
                   deleteDepartmentMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Setores/Departamentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alerta informativo */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Os setores criados aqui ficarão disponíveis para criação de leitos e internação de pacientes.
            </AlertDescription>
          </Alert>

          {/* Adicionar novo setor */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar Novo Setor</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-sector">Nome do Setor *</Label>
                <Input
                  id="new-sector"
                  value={newSectorName}
                  onChange={(e) => setNewSectorName(e.target.value)}
                  placeholder="Ex: NEUROLOGIA"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="new-sector-description">Descrição (opcional)</Label>
                <Textarea
                  id="new-sector-description"
                  value={newSectorDescription}
                  onChange={(e) => setNewSectorDescription(e.target.value)}
                  placeholder="Descrição do setor..."
                  disabled={isLoading}
                  rows={2}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddSector}
                  disabled={isLoading || !newSectorName.trim()}
                >
                  {createDepartmentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de setores existentes */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Setores Existentes</h3>
            
            {loadingDepartments ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Carregando setores...</span>
              </div>
            ) : departments.length === 0 ? (
              <p className="text-gray-500 text-center p-4">Nenhum setor encontrado</p>
            ) : (
              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    {editingSector === dept.id ? (
                      <div className="flex gap-2 flex-1">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={editSectorName}
                            onChange={(e) => setEditSectorName(e.target.value)}
                            placeholder="Nome do setor"
                            disabled={isLoading}
                          />
                          <Textarea
                            value={editSectorDescription}
                            onChange={(e) => setEditSectorDescription(e.target.value)}
                            placeholder="Descrição (opcional)"
                            disabled={isLoading}
                            rows={2}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            onClick={handleSaveEdit}
                            disabled={isLoading || !editSectorName.trim()}
                          >
                            {updateDepartmentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Salvar'
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingSector(null);
                              setEditSectorName('');
                              setEditSectorDescription('');
                            }}
                            disabled={isLoading}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="font-medium">{dept.name}</div>
                          {dept.description && (
                            <div className="text-sm text-gray-600">{dept.description}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {dept.total_beds} leitos | {dept.occupied_beds} ocupados | {dept.reserved_beds} reservados
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditSector(dept)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteSector(dept.id)}
                            disabled={isLoading || dept.total_beds > 0}
                            title={dept.total_beds > 0 ? "Não é possível excluir setor com leitos" : "Excluir setor"}
                          >
                            {deleteDepartmentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectorManagementModal;
