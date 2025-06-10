
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ExpectedDischargesHeaderProps {
  onPrint: () => void;
}

const ExpectedDischargesHeader: React.FC<ExpectedDischargesHeaderProps> = ({ onPrint }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900">Altas Previstas</h1>
    <Button onClick={onPrint} variant="outline">
      <FileText className="mr-2 h-4 w-4" />
      IMPRIMIR
    </Button>
  </div>
);

export default ExpectedDischargesHeader;
