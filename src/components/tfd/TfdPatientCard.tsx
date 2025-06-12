
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Activity, FileText, Archive, ChevronDown, ChevronUp } from 'lucide-react';
import TfdInterventionModal from '@/components/forms/TfdInterventionModal';
import { useArchiveTfdPatient } from '@/hooks/mutations/useTfdMutations';
import { useTfdInterventions } from '@/hooks/queries/useTfdQueries';
import { toast } from 'sonner';

interface TfdPatientCardProps {
  patient: any;
}

const TfdPatientCard: React.FC<TfdPatientCardProps> = ({ patient }) => {
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showAllInterventions, setShowAllInterventions] = useState(false);
  const archiveTfdMutation = useArchiveTfdPatient();
  const { data: interventions = [] } = useTfdInterventions(patient.id);

  const handleCaseResolved = async () => {
    if (window.confirm(`Confirma que o caso TFD do paciente ${patient.name} foi resolvido?`)) {
      try {
        await archiveTfdMutation.mutateAsync({
          patientId: patient.id,
          patientName: patient.name,
          patientData: patient,
          interventions: interventions
        });
      } catch (error) {
        console.error('Erro ao arquivar paciente:', error);
        toast.error('Erro ao arquivar paciente TFD');
      }
    }
  };

  const displayedInterventions = showAllInterventions ? interventions : interventions.slice(0, 3);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow border-orange-200">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
          
          <div className="space-y-2 mb-4">
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

          {/* Mostrar intervenções existentes */}
          {interventions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm text-blue-800">
                  Intervenções Realizadas ({interventions.length}):
                </p>
                {interventions.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllInterventions(!showAllInterventions)}
                    className="h-6 px-2 text-blue-600 hover:text-blue-800"
                  >
                    {showAllInterventions ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Menos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Ver todas
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {displayedInterventions.map((intervention: any, index: number) => (
                  <div key={intervention.id} className="p-2 bg-white rounded border border-blue-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        {intervention.intervention_type}
                      </span>
                      <span className="text-xs text-blue-600">
                        {new Date(intervention.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      {intervention.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowInterventionModal(true)}
              className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-300 text-blue-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <FileText className="h-4 w-4 mr-1" />
              INTERVENÇÕES
            </Button>
            <Button
              size="sm"
              onClick={handleCaseResolved}
              disabled={archiveTfdMutation.isPending}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Archive className="h-4 w-4 mr-1" />
              {archiveTfdMutation.isPending ? 'ARQUIVANDO...' : 'CASO RESOLVIDO'}
            </Button>
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

      <TfdInterventionModal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        patientId={patient.id}
        patientName={patient.name}
      />
    </>
  );
};

export default TfdPatientCard;
