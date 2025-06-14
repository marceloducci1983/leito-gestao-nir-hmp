
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';
import InvestigationModal from '@/components/forms/InvestigationModal';
import { useUpdateInvestigation } from '@/hooks/mutations/useInvestigationMutations';
import { generateInvestigationId, validateReadmissionData } from '@/utils/investigationUtils';

interface ReadmissionCardProps {
  readmission: any;
  investigation?: any;
}

const ReadmissionCard: React.FC<ReadmissionCardProps> = ({ readmission, investigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'investigated' | 'not_investigated'>('investigated');
  const updateInvestigationMutation = useUpdateInvestigation();

  const handleInvestigationClick = (action: 'investigated' | 'not_investigated') => {
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmInvestigation = async () => {
    try {
      // Validar dados da reinternação
      const validation = validateReadmissionData(readmission);
      if (!validation.isValid) {
        console.error('Dados inválidos:', validation.errors);
        return;
      }

      // Gerar chave única usando a função utilitária
      const alertKey = generateInvestigationId(
        readmission.patient_name,
        readmission.discharge_date,
        readmission.readmission_date,
        'readmission_30_days'
      );

      await updateInvestigationMutation.mutateAsync({
        alertKey,
        alertType: 'readmission_30_days',
        status: modalAction,
        notes: `Reinternação em ${readmission.days_between} dias`
      });
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao atualizar investigação:', error);
    }
  };

  const getInvestigationStatus = () => {
    if (!investigation) return null;
    
    if (investigation.investigation_status === 'investigated') {
      return (
        <div className="flex items-center gap-2 text-green-700">
          <div className="bg-green-500 text-white rounded-full p-1 shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.4)' }}>
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="font-semibold">INVESTIGADO</span>
        </div>
      );
    }
    
    if (investigation.investigation_status === 'not_investigated') {
      return (
        <div className="flex items-center gap-2 text-red-700">
          <div className="bg-red-500 text-white rounded-full p-1 shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)' }}>
            <X className="h-4 w-4" />
          </div>
          <span className="font-semibold">NÃO INVESTIGADO</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <Card className="border rounded-lg p-4">
        <CardContent className="p-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-lg">{readmission.patient_name}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{readmission.days_between} dias</Badge>
              {readmission.days_between <= 7 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Crítico
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium">Alta:</span> {new Date(readmission.discharge_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Reinternação:</span> {new Date(readmission.readmission_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Diagnóstico:</span> {readmission.diagnosis}
            </div>
            <div>
              <span className="font-medium">Origem:</span> {readmission.origin_city}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {!investigation || investigation.investigation_status === 'pending' ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleInvestigationClick('investigated')}
                    disabled={updateInvestigationMutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    INVESTIGADO
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleInvestigationClick('not_investigated')}
                    disabled={updateInvestigationMutation.isPending}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    NÃO INVESTIGADO
                  </Button>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Investigado em: {new Date(investigation.investigated_at).toLocaleString()}
                </div>
              )}
            </div>
            
            {getInvestigationStatus()}
          </div>
        </CardContent>
      </Card>

      <InvestigationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmInvestigation}
        patientName={readmission.patient_name}
        action={modalAction}
      />
    </>
  );
};

export default ReadmissionCard;
