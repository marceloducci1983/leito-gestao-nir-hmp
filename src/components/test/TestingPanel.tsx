
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestPatientsInfo from './TestPatientsInfo';
import TestDataInsertion from './TestDataInsertion';
import Phase1TestingPanel from './Phase1TestingPanel';
import Phase2TestingPanel from './Phase2TestingPanel';
import Phase4TestingPanel from './Phase4TestingPanel';

interface TestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestingPanel: React.FC<TestingPanelProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Centro de Testes do Sistema</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="insertion" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="insertion">Inserção</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="phase1">Fase 1</TabsTrigger>
            <TabsTrigger value="phase2">Fase 2</TabsTrigger>
            <TabsTrigger value="phase4">Fase 4</TabsTrigger>
          </TabsList>

          <TabsContent value="insertion" className="mt-4">
            <TestDataInsertion />
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <TestPatientsInfo />
          </TabsContent>

          <TabsContent value="phase1" className="mt-4">
            <Phase1TestingPanel />
          </TabsContent>

          <TabsContent value="phase2" className="mt-4">
            <Phase2TestingPanel />
          </TabsContent>

          <TabsContent value="phase4" className="mt-4">
            <Phase4TestingPanel />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TestingPanel;
