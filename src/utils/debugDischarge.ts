
import { supabase } from '@/integrations/supabase/client';

export const debugDischargeFunction = async (patientData: {
  patientId: string;
  patientName: string;
  bedName: string;
  department: string;
}) => {
  console.log('🔍 Testando função de alta com dados:', patientData);
  
  try {
    // Testar a função diretamente
    const { data, error } = await supabase
      .rpc('request_discharge_for_patient', {
        p_patient_id: patientData.patientId,
        p_patient_name: patientData.patientName,
        p_bed_id: patientData.bedName,
        p_department: patientData.department
      });

    if (error) {
      console.error('❌ Erro na função RPC:', error);
      return { success: false, error };
    }

    console.log('✅ Função RPC executada com sucesso, resultado:', data);
    
    // Verificar se o registro foi inserido
    const { data: checkData, error: checkError } = await supabase
      .from('discharge_control')
      .select('*')
      .eq('patient_id', patientData.patientId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar inserção:', checkError);
      return { success: false, error: checkError };
    }

    console.log('✅ Registro encontrado na tabela:', checkData);
    return { success: true, data: checkData };
    
  } catch (error) {
    console.error('❌ Erro geral na função de debug:', error);
    return { success: false, error };
  }
};
