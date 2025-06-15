
import { StatsByCity, PerformanceAnalysis } from './types';

export const analyzePerformance = (statsByCity: StatsByCity[]): PerformanceAnalysis => {
  const validStats = statsByCity.filter(stat => stat.avg_response_time_minutes > 0);
  
  const sortedByWorst = [...validStats].sort((a, b) => b.avg_response_time_minutes - a.avg_response_time_minutes);
  const sortedByBest = [...validStats].sort((a, b) => a.avg_response_time_minutes - b.avg_response_time_minutes);
  
  const totalRequests = statsByCity.reduce((sum, stat) => sum + stat.total_requests, 0);
  const weightedSum = statsByCity.reduce((sum, stat) => sum + (stat.avg_response_time_minutes * stat.total_requests), 0);
  const overallAverage = totalRequests > 0 ? weightedSum / totalRequests : 0;

  // Classificar cidades por performance
  const criticalCities = validStats.filter(stat => stat.avg_response_time_minutes > 60);
  const excellentCities = validStats.filter(stat => stat.avg_response_time_minutes < 15);

  return {
    worstPerforming: sortedByWorst.slice(0, 5),
    bestPerforming: sortedByBest.slice(0, 5),
    totalRequests,
    overallAverage,
    criticalCities,
    excellentCities
  };
};
