
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsByCityAndSector {
  origin_city: string;
  sector: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

interface StatsByCity {
  origin_city: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

interface AmbulanceStatsTableProps {
  statsByCityAndSector: StatsByCityAndSector[];
  statsByCity: StatsByCity[];
  isLoading: boolean;
}

const formatTime = (minutes: number): string => {
  if (!minutes) return '--';
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getTimeColor = (minutes: number): string => {
  if (!minutes) return 'text-gray-500';
  if (minutes < 15) return 'text-green-600';
  if (minutes < 30) return 'text-yellow-600';
  return 'text-red-600';
};

const AmbulanceStatsTable: React.FC<AmbulanceStatsTableProps> = ({
  statsByCityAndSector,
  statsByCity,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-lg">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabela por Município e Setor */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo Médio por Município e Setor</CardTitle>
        </CardHeader>
        <CardContent>
          {statsByCityAndSector.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum dado encontrado para o período selecionado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Município</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Total Solicitações</TableHead>
                    <TableHead>Tempo Médio</TableHead>
                    <TableHead>Confirmados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statsByCityAndSector.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{stat.origin_city}</TableCell>
                      <TableCell>{stat.sector}</TableCell>
                      <TableCell>{stat.total_requests}</TableCell>
                      <TableCell className={`font-mono font-bold ${getTimeColor(stat.avg_response_time_minutes)}`}>
                        {formatTime(stat.avg_response_time_minutes)}
                      </TableCell>
                      <TableCell>{stat.confirmed_requests}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela Global por Município */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo Médio Global por Município</CardTitle>
        </CardHeader>
        <CardContent>
          {statsByCity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum dado encontrado para o período selecionado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Município</TableHead>
                    <TableHead>Total Solicitações</TableHead>
                    <TableHead>Tempo Médio Global</TableHead>
                    <TableHead>Confirmados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statsByCity.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{stat.origin_city}</TableCell>
                      <TableCell>{stat.total_requests}</TableCell>
                      <TableCell className={`font-mono font-bold ${getTimeColor(stat.avg_response_time_minutes)}`}>
                        {formatTime(stat.avg_response_time_minutes)}
                      </TableCell>
                      <TableCell>{stat.confirmed_requests}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbulanceStatsTable;
