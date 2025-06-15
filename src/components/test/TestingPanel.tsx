
import React from 'react';
import { TestTube, ArrowRightLeft, Calendar } from 'lucide-react';
import { Tabs as TabsComponent, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Phase1TestingPanel from './Phase1TestingPanel';
import Phase2TestingPanel from './Phase2TestingPanel';
import Phase4TestingPanel from './Phase4TestingPanel';

const TestingPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <TabsComponent defaultValue="fase1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fase1" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            FASE 1 - ADMISSÕES
          </TabsTrigger>
          <TabsTrigger value="fase2" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            FASE 2 - TRANSFERÊNCIAS E ALTAS
          </TabsTrigger>
          <TabsTrigger value="fase4" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            FASE 4 - ALTAS PREVISTAS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fase1" className="space-y-6">
          <Phase1TestingPanel />
        </TabsContent>

        <TabsContent value="fase2">
          <Phase2TestingPanel />
        </TabsContent>

        <TabsContent value="fase4">
          <Phase4TestingPanel />
        </TabsContent>
      </TabsComponent>
    </div>
  );
};

export default TestingPanel;
