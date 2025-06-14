
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, AlertTriangle, Clock } from 'lucide-react';
import InvestigationModal from '@/components/forms/InvestigationModal';

interface PatientCardProps {
  patient: any;
  investigation?: any;
  badgeText: string;
  onInvestigate: (investigated: boolean) => void;
  isPending: boolean;
  children?: React.ReactNode;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  investigation,
  badgeText,
  onInvestigate,
  isPending,
  children
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'investigated' | 'not_investigated'>('investigated');

  const handleInvestigationClick = (action: 'investigated' | 'not_investigated') => {
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmInvestigation = () => {
    onInvestigate(modalAction === 'investigated');
    setShowModal(false);
  };

  const getInvestigationDisplay = () => {
    if (!investigation) {
      return null;
    }
    
    if (investigation.investigation_status === 'investigated') {
      return (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <div className="bg-green-500 text-white rounded-full p-1 shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.4)' }}>
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">INVESTIGADO</span>
        </div>
      );
    }
    
    if (investigation.investigation_status === 'not_investigated') {
      return (
        <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <div className="bg-red-500 text-white rounded-full p-1 shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)' }}>
            <X className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">NÃO INVESTIGADO</span>
        </div>
      );
    }
    
    return null;
  };

  const isCritical = patient.days_between && patient.days_between <= 7;

  return (
    <>
      <Card className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-gray-900">
              {patient.patient_name || patient.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {badgeText}
              </Badge>
              {isCritical && (
                <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  Crítico
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {children && (
            <div className="mb-4">
              {children}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!investigation || investigation.investigation_status === 'pending' ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleInvestigationClick('investigated')}
                    disabled={isPending}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      'INVESTIGADO'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleInvestigationClick('not_investigated')}
                    disabled={isPending}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      'NÃO INVESTIGADO'
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium">Investigado em:</span>{' '}
                  {new Date(investigation.investigated_at).toLocaleString('pt-BR')}
                </div>
              )}
            </div>
            
            <div className="flex justify-end w-full sm:w-auto">
              {getInvestigationDisplay()}
            </div>
          </div>
        </CardContent>
      </Card>

      <InvestigationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmInvestigation}
        patientName={patient.patient_name || patient.name}
        action={modalAction}
      />
    </>
  );
};

export default PatientCard;
