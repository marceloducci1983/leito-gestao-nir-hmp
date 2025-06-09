
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, MapPin, Stethoscope } from 'lucide-react';
import { format, addDays, isWithinInterval } from 'date-fns';

interface ExpectedDischargesPanelProps {
  data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  };
}

const ExpectedDischargesPanel: React.FC<ExpectedDischargesPanelProps> = ({ data }) => {
  const { discharges24h, discharges48h } = useMemo(() => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(today, 2);

    const occupiedBeds = data.beds.filter(bed => bed.isOccupied && bed.patient);
    
    const discharges24h = occupiedBeds.filter(bed => {
      const expectedDischarge = new Date(bed.patient.expectedDischargeDate);
      return isWithinInterval(expectedDischarge, { start: today, end: tomorrow });
    });

    const discharges48h = occupiedBeds.filter(bed => {
      const expectedDischarge = new Date(bed.patient.expectedDischargeDate);
      return isWithinInterval(expectedDischarge, { start: addDays(today, 1), end: dayAfterTomorrow });
    });

    return { discharges24h, discharges48h };
  }, [data.beds]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('discharges-content');
    if (printContent) {
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`
        <html>
          <head>
            <title>Altas Previstas</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 30px; }
              .section h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
              .patient-list { display: grid; gap: 15px; }
              .patient-item { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
              .patient-header { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
              .patient-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
              .info-item { display: flex; align-items: center; gap: 5px; }
              .highlight { background-color: #fffbea; border-left: 4px solid #f59e0b; padding-left: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório de Altas Previstas</h1>
              <p>Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  const PatientCard = ({ bed, isUrgent = false }: { bed: any; isUrgent?: boolean }) => (
    <Card className={`${isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-semibold text-lg">{bed.patient.name}</span>
              <Badge variant="outline">{bed.name} - {bed.department}</Badge>
            </div>
            {isUrgent && (
              <Badge className="bg-orange-500">Urgente - 24h</Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Nascimento: {formatDate(bed.patient.birthDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>Idade: {calculateAge(bed.patient.birthDate)} anos</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Admissão: {formatDate(bed.patient.admissionDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span className="font-medium">Origem: {bed.patient.originCity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-orange-600" />
              <span className="font-medium text-orange-600">
                DPA: {formatDate(bed.patient.expectedDischargeDate)}
              </span>
            </div>
            {bed.patient.specialty && (
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3 w-3" />
                <span>Especialidade: {bed.patient.specialty}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-start gap-2">
            <Stethoscope className="h-3 w-3 mt-1" />
            <span className="text-sm">{bed.patient.diagnosis}</span>
          </div>
          
          {bed.patient.isTFD && (
            <Badge variant="secondary" className="text-xs">
              TFD {bed.patient.tfdType && `- ${bed.patient.tfdType}`}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Altas Previstas</h1>
        <Button onClick={handlePrint} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          IMPRIMIR
        </Button>
      </div>

      <div id="discharges-content" className="space-y-6">
        {/* 24h Discharges */}
        <div className="section">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-orange-600">Altas 24h ({discharges24h.length} pacientes)</span>
                <Badge className="bg-orange-500">{discharges24h.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {discharges24h.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum paciente com alta prevista para as próximas 24 horas.
                </p>
              ) : (
                <div className="space-y-4">
                  {discharges24h.map((bed) => (
                    <PatientCard key={bed.id} bed={bed} isUrgent={true} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 48h Discharges */}
        <div className="section">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-blue-600">Altas 48h ({discharges48h.length} pacientes)</span>
                <Badge variant="outline">{discharges48h.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {discharges48h.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum paciente com alta prevista para 48 horas.
                </p>
              ) : (
                <div className="space-y-4">
                  {discharges48h.map((bed) => (
                    <PatientCard key={bed.id} bed={bed} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{discharges24h.length}</div>
                <div className="text-sm text-gray-600">Altas em 24h</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{discharges48h.length}</div>
                <div className="text-sm text-gray-600">Altas em 48h</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{discharges24h.length + discharges48h.length}</div>
                <div className="text-sm text-gray-600">Total de Altas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpectedDischargesPanel;
