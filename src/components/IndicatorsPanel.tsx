
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText } from 'lucide-react';
import { format, subDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface IndicatorsPanelProps {
  data: {
    beds: any[];
    archivedPatients: any[];
    dischargeMonitoring: any[];
  };
}

const IndicatorsPanel: React.FC<IndicatorsPanelProps> = ({ data }) => {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const departments = [
    'CLINICA MEDICA',
    'PRONTO SOCORRO', 
    'CLINICA CIRURGICA',
    'UTI ADULTO',
    'UTI NEONATAL',
    'PEDIATRIA',
    'MATERNIDADE'
  ];

  const indicators = useMemo(() => {
    const { beds, archivedPatients } = data;

    // Calculate overall occupancy rate
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(bed => bed.isOccupied).length;
    const overallOccupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

    // Calculate department occupancy rates
    const departmentOccupancy = departments.map(dept => {
      const deptBeds = beds.filter(bed => bed.department === dept);
      const deptOccupied = deptBeds.filter(bed => bed.isOccupied).length;
      const deptTotal = deptBeds.length;
      const occupancyRate = deptTotal > 0 ? (deptOccupied / deptTotal) * 100 : 0;

      return {
        department: dept,
        total: deptTotal,
        occupied: deptOccupied,
        available: deptTotal - deptOccupied,
        occupancyRate: occupancyRate
      };
    });

    // Calculate patients per day by department
    const patientsPerDay = departments.map(dept => {
      const deptPatients = beds.filter(bed => bed.department === dept && bed.isOccupied).length;
      return {
        department: dept,
        patients: deptPatients
      };
    });

    // Calculate average length of stay
    const relevantDischarges = archivedPatients.filter(patient => {
      const dischargeDate = new Date(patient.dischargeDate);
      return dischargeDate >= startDate && dischargeDate <= endDate;
    });

    const totalStayDays = relevantDischarges.reduce((sum, patient) => sum + patient.actualStayDays, 0);
    const averageStay = relevantDischarges.length > 0 ? totalStayDays / relevantDischarges.length : 0;

    return {
      overallOccupancyRate,
      departmentOccupancy,
      patientsPerDay,
      averageStay,
      totalDischarges: relevantDischarges.length
    };
  }, [data, startDate, endDate, departments]);

  const handlePrint = () => {
    const printContent = document.getElementById('indicators-content');
    if (printContent) {
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`
        <html>
          <head>
            <title>Relatório de Indicadores</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .period { text-align: center; margin-bottom: 20px; color: #666; }
              .indicator { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
              .indicator h3 { margin-top: 0; color: #333; }
              .department-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
              .department-item { padding: 10px; border: 1px solid #eee; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório de Indicadores Hospitalares</h1>
            </div>
            <div class="period">
              <p>Período: ${format(startDate, "dd/MM/yyyy")} a ${format(endDate, "dd/MM/yyyy")}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Indicadores</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">De:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Até:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  disabled={(date) => date > new Date() || date < startDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={handlePrint} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            IMPRIMIR
          </Button>
        </div>
      </div>

      <div id="indicators-content" className="space-y-6">
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Taxa de Ocupação Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {indicators.overallOccupancyRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total de Leitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {data.beds.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Taxa Média de Permanência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {indicators.averageStay.toFixed(1)} dias
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total de Altas (Período)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {indicators.totalDischarges}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Ocupação por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={indicators.departmentOccupancy} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  angle={-30}
                  textAnchor="end"
                  height={120}
                  fontSize={12}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupancyRate" fill="#8884d8" name="Taxa de Ocupação (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patients per Department Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes por Departamento (Atual)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={indicators.patientsPerDay}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, patients }) => `${department}: ${patients}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="patients"
                >
                  {indicators.patientsPerDay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Departamento</th>
                    <th className="text-center p-2">Total de Leitos</th>
                    <th className="text-center p-2">Ocupados</th>
                    <th className="text-center p-2">Disponíveis</th>
                    <th className="text-center p-2">Taxa de Ocupação</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.departmentOccupancy.map(dept => (
                    <tr key={dept.department} className="border-b">
                      <td className="p-2 font-medium">{dept.department}</td>
                      <td className="text-center p-2">{dept.total}</td>
                      <td className="text-center p-2 text-red-600">{dept.occupied}</td>
                      <td className="text-center p-2 text-green-600">{dept.available}</td>
                      <td className="text-center p-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          dept.occupancyRate >= 90 ? 'bg-red-100 text-red-800' :
                          dept.occupancyRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {dept.occupancyRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndicatorsPanel;
