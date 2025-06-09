
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DischargedPatient } from '@/types';

interface DischargeMonitoringProps {
  dischargeMonitoring: DischargedPatient[];
}

const DischargeMonitoring: React.FC<DischargeMonitoringProps> = ({ dischargeMonitoring }) => {
  const getTodayDischarges = () => {
    const today = new Date().toISOString().split('T')[0];
    return dischargeMonitoring.filter(patient => patient.dischargeDate === today);
  };

  const getRecentDischarges = () => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    return dischargeMonitoring.filter(patient => {
      const dischargeDate = new Date(patient.dischargeDate);
      return dischargeDate >= last7Days;
    });
  };

  const getDischargeTypeColor = (type: string) => {
    switch (type) {
      case 'POR MELHORA': return 'bg-green-500';
      case 'TRANSFERENCIA': return 'bg-blue-500';
      case 'EVASÃO': return 'bg-yellow-500';
      case 'OBITO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const todayDischarges = getTodayDischarges();
  const recentDischarges = getRecentDischarges();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">MONITORAMENTO DE ALTAS</h2>
      
      {/* Today's Discharges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Altas de Hoje ({todayDischarges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {todayDischarges.length === 0 ? (
            <p className="text-gray-500">Nenhuma alta registrada hoje.</p>
          ) : (
            <div className="space-y-3">
              {todayDischarges.map((patient) => (
                <div key={patient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <strong>{patient.name}</strong> - {patient.department}
                    <br />
                    <small className="text-gray-600">Permanência: {patient.actualStayDays} dias</small>
                  </div>
                  <Badge className={getDischargeTypeColor(patient.dischargeType)}>
                    {patient.dischargeType}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Discharges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Altas dos Últimos 7 Dias ({recentDischarges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDischarges.length === 0 ? (
            <p className="text-gray-500">Nenhuma alta nos últimos 7 dias.</p>
          ) : (
            <div className="space-y-3">
              {recentDischarges.map((patient) => (
                <div key={patient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <strong>{patient.name}</strong> - {patient.department}
                    <br />
                    <small className="text-gray-600">
                      Alta: {new Date(patient.dischargeDate).toLocaleDateString()} | 
                      Permanência: {patient.actualStayDays} dias
                    </small>
                  </div>
                  <Badge className={getDischargeTypeColor(patient.dischargeType)}>
                    {patient.dischargeType}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {dischargeMonitoring.filter(p => p.dischargeType === 'POR MELHORA').length}
            </div>
            <div className="text-sm text-gray-600">Por Melhora</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dischargeMonitoring.filter(p => p.dischargeType === 'TRANSFERENCIA').length}
            </div>
            <div className="text-sm text-gray-600">Transferências</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {dischargeMonitoring.filter(p => p.dischargeType === 'EVASÃO').length}
            </div>
            <div className="text-sm text-gray-600">Evasões</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {dischargeMonitoring.filter(p => p.dischargeType === 'OBITO').length}
            </div>
            <div className="text-sm text-gray-600">Óbitos</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DischargeMonitoring;
