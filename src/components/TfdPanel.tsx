
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive } from 'lucide-react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';
import TfdPatientCard from '@/components/tfd/TfdPatientCard';
import TfdArchiveSection from '@/components/tfd/TfdArchiveSection';

const TfdPanel: React.FC = () => {
  const { centralData, isLoading } = useSupabaseBeds();
  const [activeTab, setActiveTab] = useState('active');

  // Filtrar pacientes TFD de todos os departamentos e incluir informações do leito
  const tfdPatientsWithBeds = centralData.beds
    .filter(bed => bed.isOccupied && bed.patient?.isTFD)
    .map(bed => ({
      patient: bed.patient,
      bedInfo: {
        id: bed.id,
        name: bed.name,
        department: bed.department
      }
    }))
    .filter(item => item.patient);

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
