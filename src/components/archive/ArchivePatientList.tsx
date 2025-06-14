
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DischargedPatient } from '@/types';
import ArchivePatientCard from './ArchivePatientCard';

interface ArchivePatientListProps {
  patients: DischargedPatient[];
  totalPatients: number;
}

const ArchivePatientList: React.FC<ArchivePatientListProps> = ({ 
  patients, 
  totalPatients 
}) => {
  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          {totalPatients === 0 
            ? "Nenhum paciente arquivado ainda."
            : "Nenhum paciente encontrado com os filtros aplicados."
          }
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {patients.map((patient) => (
        <ArchivePatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default ArchivePatientList;
