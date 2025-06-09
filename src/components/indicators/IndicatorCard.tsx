
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';

interface IndicatorCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'green' | 'yellow' | 'red' | 'blue';
  children?: React.ReactNode;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue',
  children
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'border-green-200 bg-green-50';
      case 'yellow': return 'border-yellow-200 bg-yellow-50';
      case 'red': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getValueColor = () => {
    switch (color) {
      case 'green': return 'text-green-700';
      case 'yellow': return 'text-yellow-700';
      case 'red': return 'text-red-700';
      default: return 'text-blue-700';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <Card className={`${getColorClasses()} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          {icon && <div className="text-gray-500">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-2xl font-bold ${getValueColor()}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {getTrendIcon()}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndicatorCard;
