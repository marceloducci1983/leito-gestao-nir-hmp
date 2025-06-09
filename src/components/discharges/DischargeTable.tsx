
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExpectedDischarge } from '@/types/discharges';

interface DischargeTableProps {
  discharges: ExpectedDischarge[];
  title: string;
  variant: '24h' | '48h';
}

const DischargeTable: React.FC<DischargeTableProps> = ({ discharges, title, variant }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (discharges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum paciente com alta prevista para {variant === '24h' ? 'as próximas 24 horas' : 'as próximas 48 horas'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant={variant === '24h' ? "destructive" : "default"} className={variant === '48h' ? "bg-yellow-500" : ""}>
          {discharges.length} paciente{discharges.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Paciente</TableHead>
              <TableHead>Data Nascimento</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Data Admissão</TableHead>
              <TableHead>Diagnóstico</TableHead>
              <TableHead className="bg-orange-50 font-bold">DPA</TableHead>
              <TableHead className="bg-purple-50 font-bold">Município Origem</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Leito</TableHead>
              <TableHead>TFD</TableHead>
              <TableHead>Especialidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discharges.map((discharge) => (
              <TableRow key={discharge.patient.id} className={variant === '24h' ? 'bg-red-50/50' : 'bg-yellow-50/50'}>
                <TableCell className="font-medium">{discharge.patient.name}</TableCell>
                <TableCell>{formatDate(discharge.patient.birthDate)}</TableCell>
                <TableCell>{discharge.patient.age} anos</TableCell>
                <TableCell>{formatDate(discharge.patient.admissionDate)}</TableCell>
                <TableCell className="max-w-xs truncate" title={discharge.patient.diagnosis}>
                  {discharge.patient.diagnosis}
                </TableCell>
                <TableCell className="bg-orange-50 font-bold text-orange-800">
                  {formatDateTime(discharge.patient.expectedDischargeDate)}
                  <div className="text-xs text-orange-600">({discharge.hoursUntilDischarge}h)</div>
                </TableCell>
                <TableCell className="bg-purple-50 font-bold text-purple-800">
                  {discharge.patient.originCity}
                </TableCell>
                <TableCell>{discharge.patient.department}</TableCell>
                <TableCell>{discharge.patient.bedId}</TableCell>
                <TableCell>
                  {discharge.patient.isTFD ? (
                    <Badge variant="outline" className="text-xs">
                      Sim {discharge.patient.tfdType && `(${discharge.patient.tfdType})`}
                    </Badge>
                  ) : (
                    'Não'
                  )}
                </TableCell>
                <TableCell>{discharge.patient.specialty || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DischargeTable;
