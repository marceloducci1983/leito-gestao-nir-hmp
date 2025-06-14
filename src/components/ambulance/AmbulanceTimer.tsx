
import React, { useState, useEffect } from 'react';

interface AmbulanceTimerProps {
  createdAt: string;
  status: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
}

interface TimeData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CircularTimer: React.FC<{ value: number; max: number; label: string; color: string }> = ({ 
  value, 
  max, 
  label, 
  color 
}) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative w-20 h-20">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-in-out"
            strokeLinecap="round"
          />
          {/* Glowing dots */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 40 + (radius - 8) * Math.cos(angle);
            const y = 40 + (radius - 8) * Math.sin(angle);
            const isActive = i <= (value / max) * 12;
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill={isActive ? color : '#e5e7eb'}
                className={`transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
              />
            );
          })}
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {/* Label */}
      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
};

const AmbulanceTimer: React.FC<AmbulanceTimerProps> = ({ 
  createdAt, 
  status, 
  confirmedAt, 
  cancelledAt 
}) => {
  const [timeData, setTimeData] = useState<TimeData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateElapsedTime = () => {
      const startTime = new Date(createdAt).getTime();
      let endTime: number;

      // Se foi confirmado ou cancelado, usar o timestamp correspondente
      if (status === 'CONFIRMED' && confirmedAt) {
        endTime = new Date(confirmedAt).getTime();
      } else if (status === 'CANCELLED' && cancelledAt) {
        endTime = new Date(cancelledAt).getTime();
      } else {
        // Se ainda está pendente, usar o tempo atual
        endTime = new Date().getTime();
      }

      const diffInMs = endTime - startTime;
      
      if (diffInMs < 0) {
        setTimeData({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      setTimeData({ days, hours, minutes, seconds });
    };

    // Calcular imediatamente
    calculateElapsedTime();

    // Se ainda está pendente, atualizar a cada segundo
    let interval: NodeJS.Timeout | null = null;
    if (status === 'PENDING') {
      interval = setInterval(calculateElapsedTime, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [createdAt, status, confirmedAt, cancelledAt]);

  const getTimerColors = () => {
    if (status === 'CONFIRMED') {
      return {
        days: '#10b981', // emerald-500
        hours: '#059669', // emerald-600
        minutes: '#047857', // emerald-700
        seconds: '#065f46' // emerald-800
      };
    }
    
    if (status === 'CANCELLED') {
      return {
        days: '#9ca3af', // gray-400
        hours: '#6b7280', // gray-500
        minutes: '#4b5563', // gray-600
        seconds: '#374151' // gray-700
      };
    }
    
    // Para status PENDING, usar cores baseadas no tempo
    if (timeData.days >= 1) {
      return {
        days: '#f59e0b', // amber-500
        hours: '#d97706', // amber-600
        minutes: '#b45309', // amber-700
        seconds: '#92400e' // amber-800
      };
    }
    
    if (timeData.hours >= 12) {
      return {
        days: '#eab308', // yellow-500
        hours: '#ca8a04', // yellow-600
        minutes: '#a16207', // yellow-700
        seconds: '#854d0e' // yellow-800
      };
    }
    
    // Cores azuis suaves para tempo normal
    return {
      days: '#3b82f6', // blue-500
      hours: '#2563eb', // blue-600
      minutes: '#1d4ed8', // blue-700
      seconds: '#1e40af' // blue-800
    };
  };

  const colors = getTimerColors();

  // Container com gradiente suave baseado no status
  const getContainerClasses = () => {
    const baseClasses = "bg-gradient-to-br rounded-xl p-4 shadow-lg border-2 transition-all duration-300";
    
    if (status === 'CONFIRMED') {
      return `${baseClasses} from-emerald-50 to-green-50 border-emerald-200`;
    }
    
    if (status === 'CANCELLED') {
      return `${baseClasses} from-gray-50 to-slate-50 border-gray-200`;
    }
    
    if (timeData.days >= 1) {
      return `${baseClasses} from-amber-50 to-orange-50 border-amber-200`;
    }
    
    if (timeData.hours >= 12) {
      return `${baseClasses} from-yellow-50 to-amber-50 border-yellow-200`;
    }
    
    return `${baseClasses} from-blue-50 to-indigo-50 border-blue-200`;
  };

  return (
    <div className={getContainerClasses()}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center">
        {/* Mostrar dias apenas se >= 1 dia */}
        {timeData.days >= 1 && (
          <CircularTimer
            value={timeData.days}
            max={7} // Max 7 dias no display
            label="Dias"
            color={colors.days}
          />
        )}
        
        <CircularTimer
          value={timeData.hours}
          max={24}
          label="Horas"
          color={colors.hours}
        />
        
        <CircularTimer
          value={timeData.minutes}
          max={60}
          label="Min"
          color={colors.minutes}
        />
        
        <CircularTimer
          value={timeData.seconds}
          max={60}
          label="Seg"
          color={colors.seconds}
        />
      </div>
      
      {/* Texto de tempo total para referência */}
      <div className="mt-3 text-center">
        <span className="text-xs text-gray-600 font-medium">
          {timeData.days > 0 && `${timeData.days}d `}
          {timeData.hours.toString().padStart(2, '0')}:
          {timeData.minutes.toString().padStart(2, '0')}:
          {timeData.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default AmbulanceTimer;
