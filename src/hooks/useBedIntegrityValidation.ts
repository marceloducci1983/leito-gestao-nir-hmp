// FASE 3: Hook para Validação de Integridade de Leitos
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBedIntegrityValidation = () => {
  const queryClient = useQueryClient();

  const validateBedIntegrity = useCallback(async (department?: string) => {
    console.log('🔍 Iniciando validação de integridade dos leitos...');
    
    try {
      const { data: integrityIssues, error } = await supabase
        .rpc('check_bed_integrity');

      if (error) {
        console.error('❌ Erro ao verificar integridade:', error);
        return false;
      }

      if (integrityIssues && integrityIssues.length > 0) {
        console.warn('⚠️ Problemas de integridade encontrados:', integrityIssues);
        
        // Reportar apenas problemas críticos
        const criticalIssues = integrityIssues.filter((issue: any) => 
          !issue.status_consistent || issue.patient_count > 1
        );

        if (criticalIssues.length > 0) {
          toast.error(
            `Encontrados ${criticalIssues.length} problemas de integridade nos leitos. Verifique os logs.`
          );
          return false;
        }
      }

      console.log('✅ Integridade dos leitos verificada');
      return true;
    } catch (error) {
      console.error('❌ Erro na validação de integridade:', error);
      return false;
    }
  }, []);

  const validateBedAvailable = useCallback(async (bedId: string) => {
    console.log('🔍 Validando disponibilidade do leito:', bedId);
    
    try {
      const { data: patients, error } = await supabase
        .from('patients')
        .select('id, name')
        .eq('bed_id', bedId);

      if (error) {
        console.error('❌ Erro ao verificar leito:', error);
        throw new Error('Erro ao verificar disponibilidade do leito');
      }

      if (patients && patients.length > 0) {
        const patientNames = patients.map(p => p.name).join(', ');
        throw new Error(`Leito ocupado por: ${patientNames}`);
      }

      console.log('✅ Leito confirmado como disponível');
      return true;
    } catch (error) {
      console.error('❌ Erro na validação do leito:', error);
      throw error;
    }
  }, []);

  const performIntegrityCheck = useCallback(async () => {
    console.log('🧹 Executando verificação automática de integridade...');
    
    const isValid = await validateBedIntegrity();
    
    if (!isValid) {
      // Invalidar queries para forçar refresh
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      
      // Tentar refresh automático após 2 segundos
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['beds'] });
      }, 2000);
    }
    
    return isValid;
  }, [validateBedIntegrity, queryClient]);

  // Executar verificação automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(performIntegrityCheck, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [performIntegrityCheck]);

  return {
    validateBedIntegrity,
    validateBedAvailable,
    performIntegrityCheck
  };
};