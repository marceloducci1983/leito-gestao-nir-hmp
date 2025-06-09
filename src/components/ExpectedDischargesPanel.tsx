
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Printer, Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useExpectedDischarges } from '@/hooks/useExpectedDischarges';
import DischargeTable from '@/components/discharges/DischargeTable';
import DischargeCard from '@/components/discharges/DischargeCard';
import DischargeFiltersComponent from '@/components/discharges/DischargeFilters';
import { Bed, Department } from '@/types';
import { DischargeFilters } from '@/types/discharges';
import jsPDF from 'jspdf';

interface ExpectedDischargesPanelProps {
  beds: Bed[];
}

const ExpectedDischargesPanel: React.FC<ExpectedDischargesPanelProps> = ({ beds }) => {
  const [filters, setFilters] = useState<DischargeFilters>({
    sortBy: 'expectedDischargeDate',
    sortOrder: 'asc'
  });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const { toast } = useToast();
  const expectedDischarges = useExpectedDischarges(beds, filters);

  const departments: Department[] = [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  const generatePDF = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RELATÓRIO DE ALTAS PREVISTAS', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Summary
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESUMO:', margin, yPosition);
      
      yPosition += 7;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`• Total de altas previstas: ${expectedDischarges.totalCount}`, margin + 5, yPosition);
      
      yPosition += 5;
      pdf.text(`• Altas em 24h: ${expectedDischarges.urgent24h}`, margin + 5, yPosition);
      
      yPosition += 5;
      pdf.text(`• Altas em 48h: ${expectedDischarges.upcoming48h}`, margin + 5, yPosition);
      
      yPosition += 15;

      // 24h Discharges
      if (expectedDischarges.groups.within24Hours.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ALTAS PREVISTAS - 24 HORAS', margin, yPosition);
        yPosition += 10;

        expectedDischarges.groups.within24Hours.forEach((discharge) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`• ${discharge.patient.name}`, margin + 5, yPosition);
          
          yPosition += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.text(`  Nascimento: ${new Date(discharge.patient.birthDate).toLocaleDateString('pt-BR')} (${discharge.patient.age} anos)`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  DPA: ${new Date(discharge.patient.expectedDischargeDate).toLocaleString('pt-BR')}`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  Município: ${discharge.patient.originCity}`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  Setor: ${discharge.patient.department} - Leito: ${discharge.patient.bedId}`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  Diagnóstico: ${discharge.patient.diagnosis}`, margin + 10, yPosition);
          
          yPosition += 8;
        });

        yPosition += 10;
      }

      // 48h Discharges
      if (expectedDischarges.groups.within48Hours.length > 0) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ALTAS PREVISTAS - 48 HORAS', margin, yPosition);
        yPosition += 10;

        expectedDischarges.groups.within48Hours.forEach((discharge) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`• ${discharge.patient.name}`, margin + 5, yPosition);
          
          yPosition += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.text(`  Nascimento: ${new Date(discharge.patient.birthDate).toLocaleDateString('pt-BR')} (${discharge.patient.age} anos)`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  DPA: ${new Date(discharge.patient.expectedDischargeDate).toLocaleString('pt-BR')}`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  Município: ${discharge.patient.originCity}`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  Setor: ${discharge.patient.department} - Leito: ${discharge.patient.bedId}`, margin + 10, yPosition);
          
          yPosition += 4;
          pdf.text(`  Diagnóstico: ${discharge.patient.diagnosis}`, margin + 10, yPosition);
          
          yPosition += 8;
        });
      }

      pdf.save(`altas-previstas-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório de altas previstas foi baixado",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ALTAS PREVISTAS</h1>
          <p className="text-gray-600">Acompanhamento de pacientes com alta prevista nas próximas 24h e 48h</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            variant="outline"
          >
            {viewMode === 'table' ? 'Visualizar Cards' : 'Visualizar Tabela'}
          </Button>
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            IMPRIMIR
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Altas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{expectedDischarges.totalCount}</div>
            <p className="text-xs text-gray-500">Próximas 48 horas</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Altas 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{expectedDischarges.urgent24h}</div>
            <p className="text-xs text-red-500">Urgente</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Altas 48h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{expectedDischarges.upcoming48h}</div>
            <p className="text-xs text-yellow-500">Programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Última Atualização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-gray-700">{new Date().toLocaleTimeString('pt-BR')}</div>
            <p className="text-xs text-gray-500">Tempo real</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <DischargeFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        departments={departments}
      />

      {/* Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas as Altas ({expectedDischarges.totalCount})</TabsTrigger>
          <TabsTrigger value="24h" className="text-red-600">24 Horas ({expectedDischarges.urgent24h})</TabsTrigger>
          <TabsTrigger value="48h" className="text-yellow-600">48 Horas ({expectedDischarges.upcoming48h})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {viewMode === 'table' ? (
            <div className="space-y-8">
              <DischargeTable
                discharges={expectedDischarges.groups.within24Hours}
                title="ALTAS PREVISTAS - 24 HORAS"
                variant="24h"
              />
              <DischargeTable
                discharges={expectedDischarges.groups.within48Hours}
                title="ALTAS PREVISTAS - 48 HORAS"
                variant="48h"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {expectedDischarges.groups.within24Hours.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-700">ALTAS PREVISTAS - 24 HORAS</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {expectedDischarges.groups.within24Hours.map((discharge) => (
                      <DischargeCard key={discharge.patient.id} discharge={discharge} />
                    ))}
                  </div>
                </div>
              )}

              {expectedDischarges.groups.within48Hours.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-yellow-700">ALTAS PREVISTAS - 48 HORAS</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {expectedDischarges.groups.within48Hours.map((discharge) => (
                      <DischargeCard key={discharge.patient.id} discharge={discharge} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="24h">
          {viewMode === 'table' ? (
            <DischargeTable
              discharges={expectedDischarges.groups.within24Hours}
              title="ALTAS PREVISTAS - 24 HORAS"
              variant="24h"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {expectedDischarges.groups.within24Hours.map((discharge) => (
                <DischargeCard key={discharge.patient.id} discharge={discharge} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="48h">
          {viewMode === 'table' ? (
            <DischargeTable
              discharges={expectedDischarges.groups.within48Hours}
              title="ALTAS PREVISTAS - 48 HORAS"
              variant="48h"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {expectedDischarges.groups.within48Hours.map((discharge) => (
                <DischargeCard key={discharge.patient.id} discharge={discharge} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpectedDischargesPanel;
