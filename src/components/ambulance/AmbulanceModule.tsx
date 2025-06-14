import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, List, BarChart3 } from 'lucide-react';
import AmbulanceRequestForm from './AmbulanceRequestForm';
import AmbulanceRequestsList from './AmbulanceRequestsList';
import AmbulanceDashboard from './AmbulanceDashboard';

const AmbulanceModule: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Solicitação de Ambulância</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVA SOLICITAÇÃO
        </Button>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>Monitoramento</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <AmbulanceRequestsList />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <AmbulanceDashboard />
        </TabsContent>
      </Tabs>

      <AmbulanceRequestForm 
        open={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
};

export default AmbulanceModule;
