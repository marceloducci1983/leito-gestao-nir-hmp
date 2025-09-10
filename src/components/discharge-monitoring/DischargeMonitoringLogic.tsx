
import { toast } from 'sonner';

// Função modificada para calcular tempo de espera a partir das 7h da manhã do dia da solicitação
export const calculateWaitTime = (requestedAt: string) => {
  const requested = new Date(requestedAt);
  const now = new Date();
  
  // Criar data base: início do dia da solicitação + 7 horas (7h da manhã)
  const requestDay = new Date(requested);
  requestDay.setHours(0, 0, 0, 0); // Zerar horas para início do dia
  const baseTime = new Date(requestDay.getTime() + (7 * 60 * 60 * 1000)); // Adicionar 7 horas
  
  // Calcular diferença entre agora e 7h da manhã do dia da solicitação
  const diffMs = now.getTime() - baseTime.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Garantir que o tempo mínimo seja 0 (caso a solicitação seja antes das 7h)
  const finalHours = Math.max(0, hours);
  const finalMinutes = Math.max(0, minutes);
  
  return { 
    hours: finalHours, 
    minutes: finalMinutes, 
    isOverdue: finalHours >= 5 
  };
};

export const createEffectiveDischargeHandler = (
  dischargeControls: any[],
  justification: { [key: string]: string },
  completeDischargeMutation: any,
  onOpenDischargeTypeModal?: (discharge: any, requiresJustification: boolean) => void
) => {
  return (id: string) => {
    const discharge = dischargeControls.find(d => d.id === id);
    if (!discharge) return;

    const waitTime = calculateWaitTime(discharge.discharge_requested_at);
    const requiresJustification = waitTime.isOverdue;
    
    // Se um callback para abrir modal foi fornecido, usar ele
    if (onOpenDischargeTypeModal) {
      onOpenDischargeTypeModal(discharge, requiresJustification);
      return;
    }

    // Fallback para o comportamento antigo (compatibilidade)
    if (requiresJustification && !justification[id]) {
      toast.error('É necessário justificar altas com mais de 5 horas de espera.');
      return;
    }

    completeDischargeMutation.mutate({ 
      dischargeId: id, 
      justification: requiresJustification ? justification[id] : undefined,
      dischargeType: 'POR MELHORA' // valor padrão para compatibilidade
    });
  };
};
