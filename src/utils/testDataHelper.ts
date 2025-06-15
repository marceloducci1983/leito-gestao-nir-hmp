
import { supabase } from '@/integrations/supabase/client';
import { testPatients } from '@/test-data/testPatients';
import { convertDateToISO } from '@/utils/dateUtils';

export interface TestingResults {
  success: boolean;
  totalPatients: number;
  successfulAdmissions: number;
  errors: Array<{
    patientName: string;
    error: string;
  }>;
  bedsUsed: Array<{
    bedId: string;
    bedName: string;
    department: string;
    patientName: string;
  }>;
}

export const runPatientAdmissionTest = async (): Promise<TestingResults> => {
  console.log('🏥 INICIANDO TESTE DE ADMISSÃO DE PACIENTES...');
  
  const results: TestingResults = {
    success: false,
    totalPatients: testPatients.length,
    successfulAdmissions: 0,
    errors: [],
    bedsUsed: []
  };

  try {
    // Buscar leitos disponíveis por departamento
    const { data: availableBeds, error: bedsError } = await supabase
      .from('beds')
      .select('id, name, department, is_occupied, is_reserved')
      .eq('is_occupied', false)
      .eq('is_reserved', false)
      .order('department')
      .order('name');

    if (bedsError) {
      throw new Error(`Erro ao buscar leitos: ${bedsError.message}`);
    }

    if (!availableBeds || availableBeds.length === 0) {
      throw new Error('Nenhum leito disponível encontrado');
    }

    console.log(`📋 Encontrados ${availableBeds.length} leitos disponíveis`);

    // Agrupar leitos por departamento
    const bedsByDepartment = availableBeds.reduce((acc, bed) => {
      if (!acc[bed.department]) {
        acc[bed.department] = [];
      }
      acc[bed.department].push(bed);
      return acc;
    }, {} as Record<string, any[]>);

    // Processar cada paciente de teste
    for (const testPatient of testPatients) {
      try {
        console.log(`👤 Processando paciente: ${testPatient.name} - ${testPatient.department}`);

        // Verificar se há leitos disponíveis no departamento
        const departmentBeds = bedsByDepartment[testPatient.department];
        if (!departmentBeds || departmentBeds.length === 0) {
          throw new Error(`Nenhum leito disponível no departamento ${testPatient.department}`);
        }

        // Pegar o primeiro leito disponível do departamento
        const selectedBed = departmentBeds.shift(); // Remove da lista para não reutilizar
        
        if (!selectedBed) {
          throw new Error(`Não foi possível obter leito para ${testPatient.department}`);
        }

        console.log(`🛏️ Leito selecionado: ${selectedBed.name} (${selectedBed.id})`);

        // Converter data de nascimento para formato ISO
        const birthDateISO = convertDateToISO(testPatient.birthDate);
        
        // Calcular idade
        const birthDate = new Date(birthDateISO);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        // Inserir paciente
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .insert({
            name: testPatient.name,
            sex: testPatient.sex,
            birth_date: birthDateISO,
            age: age,
            admission_date: testPatient.admissionDate,
            admission_time: testPatient.admissionTime,
            diagnosis: testPatient.diagnosis,
            specialty: testPatient.specialty,
            expected_discharge_date: testPatient.expectedDischargeDate,
            origin_city: testPatient.originCity,
            is_tfd: testPatient.isTFD,
            tfd_type: testPatient.tfdType,
            department: testPatient.department as any,
            bed_id: selectedBed.id,
            occupation_days: 0
          })
          .select()
          .single();

        if (patientError) {
          throw new Error(`Erro ao inserir paciente: ${patientError.message}`);
        }

        // Marcar leito como ocupado
        const { error: bedUpdateError } = await supabase
          .from('beds')
          .update({ 
            is_occupied: true,
            is_reserved: false
          })
          .eq('id', selectedBed.id);

        if (bedUpdateError) {
          throw new Error(`Erro ao atualizar leito: ${bedUpdateError.message}`);
        }

        // Registrar sucesso
        results.successfulAdmissions++;
        results.bedsUsed.push({
          bedId: selectedBed.id,
          bedName: selectedBed.name,
          department: selectedBed.department,
          patientName: testPatient.name
        });

        console.log(`✅ ${testPatient.name} admitido com sucesso no leito ${selectedBed.name}`);

        // Pequeno delay para não sobrecarregar o banco
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Erro ao processar ${testPatient.name}:`, error);
        results.errors.push({
          patientName: testPatient.name,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    // Determinar se o teste foi bem-sucedido
    results.success = results.successfulAdmissions > 0 && results.errors.length === 0;

    console.log(`🎯 TESTE CONCLUÍDO:`);
    console.log(`   Total de pacientes: ${results.totalPatients}`);
    console.log(`   Admissões bem-sucedidas: ${results.successfulAdmissions}`);
    console.log(`   Erros: ${results.errors.length}`);

    return results;

  } catch (error) {
    console.error('❌ ERRO CRÍTICO NO TESTE:', error);
    results.errors.push({
      patientName: 'SISTEMA',
      error: error instanceof Error ? error.message : 'Erro crítico desconhecido'
    });
    return results;
  }
};

export const clearTestData = async (): Promise<void> => {
  console.log('🧹 Limpando dados de teste...');
  
  try {
    // Buscar todos os pacientes de teste (vamos usar os nomes como identificador)
    const testPatientNames = testPatients.map(p => p.name);
    
    const { data: testPatientsInDb, error: fetchError } = await supabase
      .from('patients')
      .select('id, name, bed_id')
      .in('name', testPatientNames);

    if (fetchError) {
      throw new Error(`Erro ao buscar pacientes de teste: ${fetchError.message}`);
    }

    if (!testPatientsInDb || testPatientsInDb.length === 0) {
      console.log('ℹ️ Nenhum paciente de teste encontrado para limpar');
      return;
    }

    // Liberar leitos
    const bedIds = testPatientsInDb.map(p => p.bed_id).filter(Boolean);
    if (bedIds.length > 0) {
      const { error: bedUpdateError } = await supabase
        .from('beds')
        .update({ is_occupied: false })
        .in('id', bedIds);

      if (bedUpdateError) {
        console.warn('⚠️ Erro ao liberar leitos:', bedUpdateError.message);
      }
    }

    // Remover pacientes
    const { error: deleteError } = await supabase
      .from('patients')
      .delete()
      .in('name', testPatientNames);

    if (deleteError) {
      throw new Error(`Erro ao remover pacientes: ${deleteError.message}`);
    }

    console.log(`✅ ${testPatientsInDb.length} pacientes de teste removidos com sucesso`);

  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
    throw error;
  }
};
