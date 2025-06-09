
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Activity } from 'lucide-react';
import { useSupabaseBeds } from '@/hooks/useSupabaseBeds';

const TfdPanel: React.FC = () => {
  const { centralData, isLoading } = useSupabaseBeds();

  // Filtrar pacientes TFD de todos os departamentos
  const tfdPatients = centralData.beds
    .filter(bed => bed.isOccupied && bed.patient?.isTFD)
    .map(bed => bed.patient)
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando pacientes TFD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes em TFD</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {tfdPatients.length} pacientes
        </Badge>
      </div>

      {tfdPatients.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhum paciente TFD encontrado no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tfdPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {patient.name}
                  </CardTitle>
                  <Badge 
                    variant={patient.tfdType === 'URGENCIA' ? 'destructive' : 'default'}
                    className="ml-2"
                  >
                    {patient.tfdType || 'TFD'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-600">Data de Nascimento</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {patient.birthDate}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-gray-600">Idade</p>
                    <p>{patient.age} anos</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-gray-600">Data de Admissão</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {patient.admissionDate}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-gray-600">Data Provável de Alta</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {patient.expectedDischargeDate || 'Não definida'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <p className="font-medium text-gray-600">Diagnóstico</p>
                    <p className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      {patient.diagnosis}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-600 text-orange-600">Município de Origem</p>
                    <p className="flex items-center gap-1 font-medium text-orange-700">
                      <MapPin className="h-4 w-4" />
                      {patient.originCity}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Departamento: {patient.department}</span>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      TFD: {patient.tfdType || 'Não especificado'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TfdPanel;
