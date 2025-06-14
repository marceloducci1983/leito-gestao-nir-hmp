
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download } from 'lucide-react';

interface ReportsSectionProps {
  reportStartDate: string;
  reportEndDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onGenerateReport: (period: string) => void;
  onGenerateCustomReport: () => void;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({
  reportStartDate,
  reportEndDate,
  onStartDateChange,
  onEndDateChange,
  onGenerateReport,
  onGenerateCustomReport
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerar Relatórios em PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onGenerateReport('mensal')}
          >
            <Download className="h-6 w-6 mb-2" />
            Relatório Mensal
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onGenerateReport('trimestral')}
          >
            <Download className="h-6 w-6 mb-2" />
            Relatório Trimestral
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onGenerateReport('semestral')}
          >
            <Download className="h-6 w-6 mb-2" />
            Relatório Semestral
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onGenerateReport('anual')}
          >
            <Download className="h-6 w-6 mb-2" />
            Relatório Anual
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Período Personalizado</h4>
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm text-gray-600">De:</label>
              <Input 
                type="date" 
                value={reportStartDate}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Até:</label>
              <Input 
                type="date" 
                value={reportEndDate}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </div>
            <Button onClick={onGenerateCustomReport}>
              <Download className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
