
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsByCity {
  origin_city: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

interface AmbulanceStatsChartsProps {
  statsByCity: StatsByCity[];
  isLoading: boolean;
}

const AmbulanceStatsCharts: React.FC<AmbulanceStatsChartsProps> = ({
  statsByCity,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando gráficos...</div>
      </div>
    );
  }

  if (statsByCity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico - Tempo Médio por Município</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum dado disponível para gerar gráficos.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo Médio de Resposta por Município</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={statsByCity} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="origin_city" 
              angle={-45}
              textAnchor="end"
              height={120}
              fontSize={12}
              interval={0}
            />
            <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [`${value} min`, 'Tempo Médio']}
              labelFormatter={(label) => `Cidade: ${label}`}
            />
            <Bar 
              dataKey="avg_response_time_minutes" 
              fill={(entry: any) => {
                const minutes = entry?.avg_response_time_minutes || 0;
                if (minutes < 15) return '#22c55e'; // green
                if (minutes < 30) return '#eab308'; // yellow
                return '#ef4444'; // red
              }}
              name="Tempo Médio (min)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AmbulanceStatsCharts;
