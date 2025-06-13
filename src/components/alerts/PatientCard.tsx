
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';

interface PatientCardProps {
  patient: any;
  investigation: any;
  badgeText: string;
  badgeVariant?: 'default' | 'destructive' | 'secondary' | 'outline';
  onInvestigate: (investigated: boolean) => void;
  isPending: boolean;
  children?: React.ReactNode;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  investigation,
  badgeText,
  badgeVariant = 'destructive',
  onInvestigate,
  isPending,
  children
}) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingInvestigation, setPendingInvestigation] = useState<boolean | null>(null);

  const handleInvestigateClick = (investigated: boolean) => {
    setPendingInvestigation(investigated);
    setConfirmationOpen(true);
  };

  const handleConfirmInvestigation = () => {
    if (pendingInvestigation !== null) {
      onInvestigate(pendingInvestigation);
    }
    setConfirmationOpen(false);
    setPendingInvestigation(null);
  };

  const handleCancelConfirmation = () => {
    setConfirmationOpen(false);
    setPendingInvestigation(null);
  };

  const renderInvestigationStatus = () => {
    if (investigation?.investigation_status === 'investigated') {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full shadow-md">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300 font-bold text-sm px-3 py-1 shadow-sm">
            ✓ INVESTIGADO
          </Badge>
        </div>
      );
    }
    
    if (investigation?.investigation_status === 'not_investigated') {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full shadow-md">
            <XCircle className="h-5 w-5 text-white" />
          </div>
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300 font-bold text-sm px-3 py-1 shadow-sm">
            ✗ NÃO INVESTIGADO
          </Badge>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-green-50 hover:bg-green-100 border-green-300 hover:border-green-400 text-green-700 hover:text-green-800 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          onClick={() => handleInvestigateClick(true)}
          disabled={isPending}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          INVESTIGADO
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-red-50 hover:bg-red-100 border-red-300 hover:border-red-400 text-red-700 hover:text-red-800 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          onClick={() => handleInvestigateClick(false)}
          disabled={isPending}
        >
          <XCircle className="h-4 w-4 mr-1" />
          NÃO INVESTIGADO
        </Button>
      </div>
    );
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{patient.name || patient.patient_name}</h3>
                <Badge variant={badgeVariant}>{badgeText}</Badge>
              </div>
              
              {children}
              
              <div>
                <p className="text-gray-600">Diagnóstico</p>
                <p>{patient.diagnosis}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              {renderInvestigationStatus()}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={confirmationOpen}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmInvestigation}
        isInvestigated={pendingInvestigation === true}
        patientName={patient.name || patient.patient_name}
      />
    </>
  );
};

export default PatientCard;
