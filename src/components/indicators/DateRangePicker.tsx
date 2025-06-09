
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DateFilter } from '@/types/indicators';

interface DateRangePickerProps {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateFilter,
  onDateFilterChange
}) => {
  const handleStartDateChange = (date: string) => {
    onDateFilterChange({
      ...dateFilter,
      startDate: date
    });
  };

  const handleEndDateChange = (date: string) => {
    onDateFilterChange({
      ...dateFilter,
      endDate: date
    });
  };

  const resetToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateFilterChange({
      startDate: today,
      endDate: today
    });
  };

  const setLast7Days = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    onDateFilterChange({
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  };

  const setLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    onDateFilterChange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Período:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">De:</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Até:</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={resetToToday} variant="outline" size="sm">
              Hoje
            </Button>
            <Button onClick={setLast7Days} variant="outline" size="sm">
              7 Dias
            </Button>
            <Button onClick={setLast30Days} variant="outline" size="sm">
              30 Dias
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangePicker;
