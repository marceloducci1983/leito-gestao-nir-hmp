
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDateTimeSaoPaulo } from '@/utils/timezoneUtils';

interface AnalyticsChartsProps {
  dischargeStatsByDept: any[];
  dischargeStatsByCity: any[];
  delayedDischarges: any[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  dischargeStatsByDept,
  dischargeStatsByCity,
  delayedDischarges
}) => {
  const dischargeStatsByDeptInMinutes = dischargeStatsByDept.map(stat => ({
    ...stat,
    avg_minutes: Math.round((stat.avg_hours || 0) * 60)
  }));

  const dischargeStatsByCityInMinutes = dischargeStatsByCity.map(stat => ({
    ...stat,
    avg_minutes: Math.round((stat.avg_hours || 0) * 60)
  }));

  const delayedDischargesInMinutes = delayedDischarges.map(delayed => ({
    ...delayed,
    delay_minutes: Math.round((delayed.delay_hours || 0) * 60)
  }));

  return (
    <div className="space-y-6">
      {/* Info sobre nova metodologia de cálculo */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium mt-0.5">
              ℹ
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Metodologia de Cálculo</p>
              <p className="text-blue-700">
                Os tempos exibidos neste dashboard são calculados a partir das <strong>07:00h da manhã</strong> do dia da solicitação de alta até o momento da efetivação, 
                proporcionando uma visão mais padronizada dos tempos de processamento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Alta por Departamento (minutos)</CardTitle>
            <p className="text-sm text-gray-600">Calculado a partir das 07:00h do dia da solicitação</p>
          </CardHeader>
          <CardContent>
            {dischargeStatsByDeptInMinutes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum dado de estatísticas por departamento encontrado.</p>
                <p className="text-sm">Dados aparecem após altas serem processadas.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dischargeStatsByDeptInMinutes} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    angle={-30}
                    textAnchor="end"
                    height={120}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value}min`, 'Temp. Medio (desde 07:00h)']} />
                  <Bar dataKey="avg_minutes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Alta por Município (minutos)</CardTitle>
            <p className="text-sm text-gray-600">Calculado a partir das 07:00h do dia da solicitação</p>
          </CardHeader>
          <CardContent>
            {dischargeStatsByCityInMinutes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum dado de estatísticas por município encontrado.</p>
                <p className="text-sm">Dados aparecem após altas serem processadas.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dischargeStatsByCityInMinutes.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="origin_city" 
                    angle={-30}
                    textAnchor="end"
                    height={120}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value}min`, 'Temp. Medio (desde 07:00h)']} />
                  <Bar dataKey="avg_minutes" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Altas com Demora Superior a 5 Horas</CardTitle>
          <p className="text-sm text-gray-600">Baseado no tempo desde 07:00h do dia da solicitação</p>
        </CardHeader>
        <CardContent>
          {delayedDischargesInMinutes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma alta com demora superior a 5 horas registrada.
            </p>
          ) : (
            <div className="space-y-3">
              {delayedDischargesInMinutes.map((delayed, index) => (
                <div key={index} className="p-4 border rounded-lg bg-orange-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{delayed.patient_name}</h4>
                      <p className="text-sm text-gray-600">{delayed.department}</p>
                      <p className="text-sm">
                        Tempo de espera: <span className="font-medium text-orange-600">{delayed.delay_minutes}min</span>
                        <span className="text-xs text-gray-500 ml-1">(desde 07:00h)</span>
                      </p>
                      <p className="text-sm">
                        Solicitado: {formatDateTimeSaoPaulo(delayed.discharge_requested_at)}
                      </p>
                      <p className="text-sm">
                        Efetivado: {formatDateTimeSaoPaulo(delayed.discharge_effective_at)}
                      </p>
                    </div>
                    {delayed.justification && (
                      <div className="max-w-md">
                        <p className="text-sm font-medium">Justificativa:</p>
                        <p className="text-sm text-gray-700">{delayed.justification}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
