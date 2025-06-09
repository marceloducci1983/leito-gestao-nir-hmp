
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPanelProps {
  title: string;
  description: string;
}

const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{description}</p>
          <p className="text-sm text-gray-500 mt-4">
            Este módulo será implementado nas próximas versões do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPanel;
