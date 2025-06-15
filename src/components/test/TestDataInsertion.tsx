
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Plus, Trash } from 'lucide-react';
import { useAddPatient } from '@/hooks/mutations/usePatientMutations';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { testPatients } from '@/test-data/testPatients';
import { convertDateToISO } from '@/utils/dateUtils';
import { toast } from 'sonner';

const TestDataInsertion: React.FC = () => {
  const [isInserting, setIsInserting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const addPatientMutation = useAddPatient();
  const queryClient = useQueryClient();

  // Get available beds
  const { data: availableBeds } = useQuery({
    queryKey: ['available-beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select('id, name, department, is_occupied, is_reserved')
        .eq('is_occupied', false)
        .eq('is_reserved', false)
        .order('department')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Count patients by department
  const patientsByDepartment = testPatients.reduce((acc, patient) => {
    acc[patient.department] = (acc[patient.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleInsertTestData = async () => {
    if (!availableBeds || availableBeds.length === 0) {
      toast.error('Nenhum leito disponível encontrado');
      return;
    }

    setIsInserting(true);
    let successCount = 0;
    let errorCount = 0;

    // Group beds by department
    const bedsByDepartment = availableBeds.reduce((acc, bed) => {
      if (!acc[bed.department]) {
        acc[bed.department] = [];
      }
      acc[bed.department].push(bed);
      return acc;
    }, {} as Record<string, any[]>);

    try {
      for (const patient of testPatients) {
        try {
          // Find available bed in the department
          const departmentBeds = bedsByDepartment[patient.department];
          if (!departmentBeds || departmentBeds.length === 0) {
            console.warn(`Nenhum leito disponível em ${patient.department}`);
            errorCount++;
            continue;
          }

          const selectedBed = departmentBeds.shift(); // Remove from available list
          
          // Calculate age
          const birthDate = new Date(convertDateToISO(patient.birthDate));
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          const patientData = {
            name: patient.name,
            sex: patient.sex,
            birthDate: convertDateToISO(patient.birthDate),
            age: age,
            admissionDate: patient.admissionDate,
            admissionTime: patient.admissionTime,
            diagnosis: patient.diagnosis,
            specialty: patient.specialty || '',
            expectedDischargeDate: patient.expectedDischargeDate,
            originCity: patient.originCity,
            isTFD: patient.isTFD,
            tfdType: patient.tfdType || '',
            department: patient.department,
            occupationDays: 0
          };

          await new Promise((resolve, reject) => {
            addPatientMutation.mutate(
              { bedId: selectedBed.id, patientData },
              {
                onSuccess: () => {
                  successCount++;
                  resolve(true);
                },
                onError: (error) => {
                  console.error(`Erro ao inserir ${patient.name}:`, error);
                  errorCount++;
                  reject(error);
                }
              }
            );
          });

          // Small delay to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
          console.error(`Erro ao processar ${patient.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} pacientes inseridos com sucesso!`);
        queryClient.invalidateQueries({ queryKey: ['beds'] });
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} pacientes não puderam ser inseridos`);
      }

    } catch (error) {
      console.error('Erro geral na inserção:', error);
      toast.error('Erro ao inserir pacientes de teste');
    } finally {
      setIsInserting(false);
    }
  };

  const handleClearTestData = async () => {
    setIsClearing(true);
    
    try {
      const testPatientNames = testPatients.map(p => p.name);
      
      // Find test patients in database
      const { data: testPatientsInDb, error: fetchError } = await supabase
        .from('patients')
        .select('id, name, bed_id')
        .in('name', testPatientNames);

      if (fetchError) {
        throw fetchError;
      }

      if (!testPatientsInDb || testPatientsInDb.length === 0) {
        toast.info('Nenhum paciente de teste encontrado');
        return;
      }

      // Free beds first
      const bedIds = testPatientsInDb.map(p => p.bed_id).filter(Boolean);
      if (bedIds.length > 0) {
        const { error: bedError } = await supabase
          .from('beds')
          .update({ is_occupied: false })
          .in('id', bedIds);

        if (bedError) {
          console.warn('Erro ao liberar leitos:', bedError);
        }
      }

      // Remove patients
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .in('name', testPatientNames);

      if (deleteError) {
        throw deleteError;
      }

      toast.success(`${testPatientsInDb.length} pacientes de teste removidos`);
      queryClient.invalidateQueries({ queryKey: ['beds'] });

    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast.error('Erro ao limpar dados de teste');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Inserção de Pacientes de Teste
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(patientsByDepartment).map(([dept, count]) => (
            <div key={dept} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-xs font-medium">{dept}</span>
              <Badge variant="secondary">{count}</Badge>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Total de pacientes fictícios: <strong>{testPatients.length}</strong></p>
          <p>Leitos disponíveis: <strong>{availableBeds?.length || 0}</strong></p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInsertTestData}
            disabled={isInserting || !availableBeds || availableBeds.length === 0}
            className="flex-1"
          >
            {isInserting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Inserindo...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Inserir Pacientes
              </>
            )}
          </Button>

          <Button
            onClick={handleClearTestData}
            disabled={isClearing}
            variant="outline"
            className="flex-1"
          >
            {isClearing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Removendo...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Limpar Dados
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDataInsertion;
