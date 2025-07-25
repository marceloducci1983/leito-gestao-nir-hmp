import { useState } from 'react';
import { useRequestDischarge } from '@/hooks/mutations/useDischargeMutations';
import { useDischargePatient } from '@/hooks/mutations/usePatientMutations';
import { toast } from 'sonner';

export const useDischargeFlow = () => {
  const [isProcessing, setIsProcessing] = useState<Set<string>>(new Set());
  const requestDischargeMutation = useRequestDischarge();
  const dischargePatientMutation = useDischargePatient();

  const setIsDischarging = (bedId: string, status: boolean) => {
    setIsProcessing(prev => {
      const newSet = new Set(prev);
      if (status) {
        newSet.add(bedId);
      } else {
        newSet.delete(bedId);
      }
      return newSet;
    });
  };

  const isDischarging = (bedId: string) => {
    return isProcessing.has(bedId);
  };

  const handleDischargeRequest = async (patientData: {
    patientId: string;
    patientName: string;
    bedId: string;
    department: string;
    bedName: string;
  }) => {
    console.log('🏥 Iniciando solicitação de alta no flow para:', patientData);
    
    setIsDischarging(patientData.bedId, true);

    try {
      console.log('📤 Enviando dados para mutation:', {
        patientId: patientData.patientId,
        patientName: patientData.patientName,
        bedId: patientData.bedId,
        department: patientData.department,
        bedName: patientData.bedName
      });

      await requestDischargeMutation.mutateAsync({
        patientId: patientData.patientId,
        patientName: patientData.patientName,
        bedId: patientData.bedId,
        department: patientData.department,
        bedName: patientData.bedName
      });

      console.log('✅ Solicitação de alta criada com sucesso no flow');
      return { success: true, type: 'request' };
    } catch (error) {
      console.error('❌ Erro na solicitação de alta no flow:', error);
      return { success: false, error };
    } finally {
      setIsDischarging(patientData.bedId, false);
    }
  };

  const handleDirectDischarge = async (patientData: {
    patientId: string;
    bedId: string;
    dischargeType: string;
    dischargeDate: string;
  }) => {
    console.log('🏥 Iniciando alta direta para:', patientData);
    
    setIsDischarging(patientData.bedId, true);

    try {
      await dischargePatientMutation.mutateAsync({
        bedId: patientData.bedId,
        patientId: patientData.patientId,
        dischargeData: {
          dischargeType: patientData.dischargeType,
          dischargeDate: patientData.dischargeDate
        }
      });

      console.log('✅ Alta direta realizada com sucesso');
      return { success: true, type: 'direct' };
    } catch (error) {
      console.error('❌ Erro na alta direta:', error);
      return { success: false, error };
    } finally {
      setIsDischarging(patientData.bedId, false);
    }
  };

  return {
    handleDischargeRequest,
    handleDirectDischarge,
    isDischarging,
    setIsDischarging,
    isRequestingDischarge: requestDischargeMutation.isPending,
    isDischargingPatient: dischargePatientMutation.isPending
  };
};
