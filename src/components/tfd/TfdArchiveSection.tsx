
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Archive, Calendar, MapPin } from 'lucide-react';
import { useTfdArchives } from '@/hooks/queries/useTfdQueries';

interface TfdPatientData {
  originCity?: string;
  diagnosis?: string;
  tfdType?: string;
}

interface TfdIntervention {
  intervention_type: string;
  description: string;
}

const TfdArchiveSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: archives = [], isLoading } = useTfdArchives();

  const filteredArchives = archives.filter(archive => {
    const patientData = archive.patient_data as TfdPatientData;
    const searchLower = searchTerm.toLowerCase();
    
    return archive.patient_name.toLowerCase().includes(searchLower) ||
      (patientData?.originCity?.toLowerCase() || '').includes(searchLower) ||
      (patientData?.diagnosis?.toLowerCase() || '').includes(searchLower) ||
      (patientData?.tfdType?.toLowerCase() || '').includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-lg">Carregando arquivos TFD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, cidade, diagnóstico ou tipo de TFD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredArchives.length} casos arquivados
        </Badge>
      </div>

      {filteredArchives.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum caso encontrado com os critérios de busca.' : 'Nenhum caso TFD arquivado ainda.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArchives.map((archive) => {
            const patientData = archive.patient_data as TfdPatientData;
            const interventions = Array.isArray(archive.interventions) ? 
              (archive.interventions as unknown as TfdIntervention[]) : [];
            
            return (
              <Card key={archive.id} className="bg-gray-50 border-gray-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Archive className="h-5 w-5 text-gray-600" />
                      {archive.patient_name}
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Caso Resolvido
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="font-medium text-gray-600">Data de Arquivo</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(archive.archived_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-600">Município</p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {patientData?.originCity || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-600">Diagnóstico</p>
                      <p>{patientData?.diagnosis || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-600">Tipo TFD</p>
                      <p>{patientData?.tfdType || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Mostrar intervenções se existirem */}
                  {interventions.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-sm text-blue-800 mb-2">
                        Intervenções Realizadas ({interventions.length}):
                      </p>
                      <div className="space-y-1">
                        {interventions.slice(0, 3).map((intervention, index) => (
                          <div key={index} className="text-xs text-blue-700">
                            <strong>{intervention.intervention_type}:</strong> {intervention.description}
                          </div>
                        ))}
                        {interventions.length > 3 && (
                          <p className="text-xs text-blue-600">+ {interventions.length - 3} mais...</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TfdArchiveSection;
