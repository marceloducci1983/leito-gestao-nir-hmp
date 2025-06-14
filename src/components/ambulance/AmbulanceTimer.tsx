
import React, { useState, useEffect } from 'react';

interface AmbulanceTimerProps {
  createdAt: string;
  status: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
}

const AmbulanceTimer: React.FC<AmbulanceTimerProps> = ({ 
  createdAt, 
  status, 
  confirmedAt, 
  cancelledAt 
}) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

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
        setElapsedTime('00:00:00');
        return;
      }

      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      const formattedTime = [hours, minutes, seconds]
        .map(unit => unit.toString().padStart(2, '0'))
        .join(':');

      setElapsedTime(formattedTime);
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
    if (status === 'CONFIRMED') return 'text-green-600';
    if (status === 'CANCELLED') return 'text-red-600';
    
    // Para status PENDING, usar cores baseadas no tempo
    const [hours] = elapsedTime.split(':').map(Number);
    if (hours >= 2) return 'text-red-600';
    if (hours >= 1) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className={`font-mono text-lg font-bold ${getTimerColor()}`}>
      {elapsedTime}
    </div>
  );
};

export default AmbulanceTimer;
