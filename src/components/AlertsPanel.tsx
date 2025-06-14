
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import { useAlertsData } from '@/hooks/useAlertsData';
import { useOccupationDaysUpdater } from '@/hooks/useOccupationDaysUpdater';
import LongStayPatients from './alerts/LongStayPatients';
import ReadmissionPatients from './alerts/ReadmissionPatients';

const AlertsPanel: React.FC = () => {
  const {
    longStayPatients,
    readmissions,
    getInvestigationStatus,
    sortOrder,
    setSortOrder,
    isLoading
  } = useAlertsData();

  // Hook para atualização automática dos dias de ocupação
  useOccupationDaysUpdater();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando alertas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Alertas de Intervenção</h1>
        <div className="flex gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {longStayPatients.length + readmissions.length} alertas
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="long-stay" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="long-stay">
            Internações + 15 dias ({longStayPatients.length})
          </TabsTrigger>
          <TabsTrigger value="readmissions">
            Reinternações - 30 dias ({readmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="long-stay">
          <LongStayPatients
            patients={longStayPatients}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            getInvestigationStatus={getInvestigationStatus}
          />
        </TabsContent>

        <TabsContent value="readmissions">
          <ReadmissionPatients
            readmissions={readmissions}
            getInvestigationStatus={getInvestigationStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsPanel;
