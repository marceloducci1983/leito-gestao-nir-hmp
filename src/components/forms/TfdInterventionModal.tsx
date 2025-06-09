
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddTfdIntervention } from '@/hooks/mutations/useTfdMutations';

interface TfdInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const TfdInterventionModal: React.FC<TfdInterventionModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName
}) => {
  const [interventionType, setInterventionType] = useState<'EMAIL' | 'LIGACAO' | 'WPP' | 'PLANO_DE_SAUDE' | 'OUTROS'>('EMAIL');
  const [description, setDescription] = useState('');

  const addInterventionMutation = useAddTfdIntervention();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      return;
    }

    try {
      await addInterventionMutation.mutateAsync({
        patientId,
        interventionType,
        description: description.trim()
      });
      
      setDescription('');
      setInterventionType('EMAIL');
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar intervenção:', error);
    }
  };

  const handleClose = () => {
    setDescription('');
    setInterventionType('EMAIL');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Intervenção TFD - {patientName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="intervention_type">Tipo de Intervenção*</Label>
            <Select value={interventionType} onValueChange={(value: any) => setInterventionType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de intervenção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="LIGACAO">Ligação</SelectItem>
                <SelectItem value="WPP">WhatsApp</SelectItem>
                <SelectItem value="PLANO_DE_SAUDE">Plano de Saúde</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição da Intervenção*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a intervenção realizada..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!description.trim() || addInterventionMutation.isPending}
            >
              {addInterventionMutation.isPending ? 'Salvando...' : 'Salvar Intervenção'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TfdInterventionModal;
