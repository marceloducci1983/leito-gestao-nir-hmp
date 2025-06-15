
export interface StatsByCityAndSector {
  origin_city: string;
  sector: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

export interface StatsByCity {
  origin_city: string;
  total_requests: number;
  avg_response_time_minutes: number;
  confirmed_requests: number;
}

export interface PerformanceAnalysis {
  worstPerforming: StatsByCity[];
  bestPerforming: StatsByCity[];
  totalRequests: number;
  overallAverage: number;
  criticalCities: StatsByCity[];
  excellentCities: StatsByCity[];
}
