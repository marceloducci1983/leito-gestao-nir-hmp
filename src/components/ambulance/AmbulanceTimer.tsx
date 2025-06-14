
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

  // Formatação para exibir os números com zero à esquerda
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Se há dias, mostrar no formato DD:HH:MM:SS, senão HH:MM:SS
  const displayHours = timeData.days > 0 ? timeData.days * 24 + timeData.hours : timeData.hours;

  return (
    <div className="inline-flex items-center justify-center bg-white border border-gray-200 rounded-md px-3 py-2">
      <div className="flex items-center space-x-4">
        {/* HORAS */}
        <div className="flex flex-col items-center">
          <span className="text-lg font-mono font-bold" style={{ color: '#FF0000' }}>
            {formatNumber(displayHours)}
          </span>
          <span className="text-xs font-medium" style={{ color: '#FF0000' }}>
            HORAS
          </span>
        </div>

        {/* Separador */}
        <span className="text-lg font-mono font-bold" style={{ color: '#FF0000' }}>:</span>

        {/* MINUTOS */}
        <div className="flex flex-col items-center">
          <span className="text-lg font-mono font-bold" style={{ color: '#FF0000' }}>
            {formatNumber(timeData.minutes)}
          </span>
          <span className="text-xs font-medium" style={{ color: '#FF0000' }}>
            MIN
          </span>
        </div>

        {/* Separador */}
        <span className="text-lg font-mono font-bold" style={{ color: '#FF0000' }}>:</span>

        {/* SEGUNDOS */}
        <div className="flex flex-col items-center">
          <span className="text-lg font-mono font-bold" style={{ color: '#FF0000' }}>
            {formatNumber(timeData.seconds)}
          </span>
          <span className="text-xs font-medium" style={{ color: '#FF0000' }}>
            SEG
          </span>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceTimer;
