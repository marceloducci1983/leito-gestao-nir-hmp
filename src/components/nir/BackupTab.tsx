
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Database, Download } from 'lucide-react';

interface BackupTabProps {
  onBackup: () => void;
  onExportData: () => void;
}

export const BackupTab: React.FC<BackupTabProps> = ({ onBackup, onExportData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backup e Restauração
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={onBackup} className="h-20 flex-col">
            <Database className="h-6 w-6 mb-2" />
            Realizar Backup Agora
          </Button>
          
          <Button onClick={onExportData} variant="outline" className="h-20 flex-col">
            <Download className="h-6 w-6 mb-2" />
            Exportar Dados
          </Button>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Histórico de Backups</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Backup Automático</p>
                <p className="text-sm text-gray-600">09/06/2025 - 03:00</p>
              </div>
              <Button variant="outline" size="sm">Restaurar</Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Backup Manual</p>
                <p className="text-sm text-gray-600">08/06/2025 - 14:30</p>
              </div>
              <Button variant="outline" size="sm">Restaurar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
