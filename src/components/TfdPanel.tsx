
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Printer } from 'lucide-react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import TfdPatientCard from '@/components/tfd/TfdPatientCard';
import TfdArchiveSection from '@/components/tfd/TfdArchiveSection';
import { generateTfdPatientsPdf } from '@/utils/pdfReportGenerator';
import { useTfdInterventions } from '@/hooks/queries/useTfdQueries';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TfdPanel: React.FC = () => {
  const { centralData, isLoading } = useSupabaseBeds();
  const [activeTab, setActiveTab] = useState('active');

  // Filtrar pacientes TFD de todos os departamentos e incluir informações do leito
  console.log('🔍 TfdPanel - Verificando leitos ocupados:', centralData.beds.filter(bed => bed.isOccupied).length);
  console.log('🔍 TfdPanel - Leitos com pacientes:', centralData.beds.filter(bed => bed.isOccupied && bed.patient).length);
  console.log('🔍 TfdPanel - Verificando pacientes TFD:', centralData.beds
    .filter(bed => bed.isOccupied && bed.patient)
    .map(bed => ({
      nome: bed.patient?.name,
      isTFD: bed.patient?.isTFD,
      tfdType: bed.patient?.tfdType,
      leito: bed.name
    }))
  );
  
  const tfdPatientsWithBeds = centralData.beds
    .filter(bed => {
      const hasTFD = bed.isOccupied && bed.patient?.isTFD;
      if (bed.patient && bed.patient.tfdType) {
        console.log(`🔍 TfdPanel - Paciente ${bed.patient.name}: isTFD=${bed.patient.isTFD}, tfdType=${bed.patient.tfdType}, incluído=${hasTFD}`);
      }
      return hasTFD;
    })
    .map(bed => ({
      patient: bed.patient,
      bedInfo: {
        id: bed.id,
        name: bed.name,
        department: bed.department
      }
    }))
    .filter(item => item.patient);

  const handlePrintActivePatients = async () => {
    if (tfdPatientsWithBeds.length === 0) {
      toast.error('Nenhum paciente TFD ativo para imprimir');
      return;
    }

    try {
      toast.info('Gerando relatório detalhado...');
      
      // Buscar intervenções para cada paciente
      const patientsWithInterventions = await Promise.all(
        tfdPatientsWithBeds.map(async (item) => {
          const { data: interventions } = await supabase
            .from('tfd_interventions')
            .select('*')
            .eq('patient_id', item.patient.id)
            .order('created_at', { ascending: false });
          
          return {
            ...item,
            interventions: interventions || []
          };
        })
      );

      generateTfdPatientsPdf(patientsWithInterventions);
      toast.success('Relatório PDF detalhado gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando pacientes TFD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes em TFD</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {tfdPatientsWithBeds.length} pacientes ativos
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Pacientes Ativos ({tfdPatientsWithBeds.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Arquivos de TFD
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Botão IMPRIMIR */}
          <div className="flex justify-end">
            <Button
              onClick={handlePrintActivePatients}
              variant="outline"
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 font-medium"
            >
              <Printer className="h-4 w-4" />
              IMPRIMIR
            </Button>
          </div>

          {tfdPatientsWithBeds.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Nenhum paciente TFD encontrado no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tfdPatientsWithBeds.map((item) => (
                <TfdPatientCard 
                  key={item.patient.id} 
                  patient={item.patient} 
                  bedInfo={item.bedInfo}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived">
          <TfdArchiveSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TfdPanel;
