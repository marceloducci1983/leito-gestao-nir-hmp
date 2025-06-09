
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DischargedPatient } from '@/types';

interface ArchivePanelProps {
  archivedPatients: DischargedPatient[];
}

const ArchivePanel: React.FC<ArchivePanelProps> = ({ archivedPatients }) => {
  const getDischargeTypeColor = (type: string) => {
    switch (type) {
      case 'POR MELHORA': return 'bg-green-500';
      case 'TRANSFERENCIA': return 'bg-blue-500';
      case 'EVASÃO': return 'bg-yellow-500';
      case 'OBITO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ARQUIVO DE PACIENTES</h2>
      
      <div className="grid gap-4">
        {archivedPatients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Nenhum paciente arquivado ainda.
            </CardContent>
          </Card>
        ) : (
          archivedPatients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <Badge className={getDischargeTypeColor(patient.dischargeType)}>
                    {patient.dischargeType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Idade:</strong> {patient.age} anos
                  </div>
                  <div>
                    <strong>Departamento:</strong> {patient.department}
                  </div>
                  <div>
                    <strong>Leito:</strong> {patient.bedId.split('-').pop()}
                  </div>
                  <div>
                    <strong>Admissão:</strong> {new Date(patient.admissionDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Alta:</strong> {new Date(patient.dischargeDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Permanência:</strong> {patient.actualStayDays} dias
                  </div>
                  <div>
                    <strong>Origem:</strong> {patient.originCity}
                  </div>
                  <div>
                    <strong>TFD:</strong> {patient.isTFD ? 'Sim' : 'Não'}
                  </div>
                  <div className="col-span-2 md:col-span-3 lg:col-span-4">
                    <strong>Diagnóstico:</strong> {patient.diagnosis}
                  </div>
                  {patient.specialty && (
                    <div className="col-span-2">
                      <strong>Especialidade:</strong> {patient.specialty}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivePanel;
