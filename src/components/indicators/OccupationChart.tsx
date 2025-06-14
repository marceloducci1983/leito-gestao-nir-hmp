
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DepartmentOccupation } from '@/types/indicators';

interface OccupationChartProps {
  data: DepartmentOccupation[];
  type: 'pie' | 'bar';
}

const OccupationChart: React.FC<OccupationChartProps> = ({ data, type }) => {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316'];

  if (type === 'pie') {
    const pieData = data.map(item => ({
      name: item.department,
      value: item.occupationRate,
      occupied: item.occupiedBeds,
      total: item.totalBeds
    }));

    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taxa de Ocupação']} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="department" 
          angle={-30}
          textAnchor="end"
          height={120}
          fontSize={12}
          interval={0}
        />
        <YAxis label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taxa de Ocupação']}
          labelFormatter={(label) => `Setor: ${label}`}
        />
        <Bar dataKey="occupationRate" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OccupationChart;
