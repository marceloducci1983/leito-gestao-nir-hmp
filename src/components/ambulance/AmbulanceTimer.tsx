
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

  const getTimerColor = () => {
    if (status === 'CONFIRMED') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (status === 'CANCELLED') return 'text-gray-500 bg-gray-50 border-gray-200';
    
    // Para status PENDING, usar cores baseadas no tempo
    if (timeData.days >= 1) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (timeData.hours >= 12) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const formatTime = () => {
    if (timeData.days > 0) {
      return `${timeData.days}d ${timeData.hours.toString().padStart(2, '0')}:${timeData.minutes.toString().padStart(2, '0')}`;
    }
    return `${timeData.hours.toString().padStart(2, '0')}:${timeData.minutes.toString().padStart(2, '0')}:${timeData.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-md border text-sm font-mono font-medium ${getTimerColor()}`}>
      {formatTime()}
    </div>
  );
};

export default AmbulanceTimer;
