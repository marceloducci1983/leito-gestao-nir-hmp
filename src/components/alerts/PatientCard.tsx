
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';

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
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
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
            {investigation?.investigation_status === 'investigated' ? (
              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="h-4 w-4 mr-1" />
                Investigado
              </Badge>
            ) : investigation?.investigation_status === 'not_investigated' ? (
              <Badge variant="destructive">
                <XCircle className="h-4 w-4 mr-1" />
                Não Investigado
              </Badge>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 border-green-200"
                  onClick={() => onInvestigate(true)}
                  disabled={isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Investigado
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-50 hover:bg-red-100 border-red-200"
                  onClick={() => onInvestigate(false)}
                  disabled={isPending}
                >
                  <XCircle className="h-4 w-4" />
                  Não Investigado
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
