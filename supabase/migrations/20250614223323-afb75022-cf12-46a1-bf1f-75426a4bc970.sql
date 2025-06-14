
-- Função para obter estatísticas por cidade e setor
CREATE OR REPLACE FUNCTION public.get_ambulance_stats_by_city_and_sector(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
  origin_city TEXT,
  sector TEXT,
  total_requests BIGINT,
  avg_response_time_minutes NUMERIC,
  confirmed_requests BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    ar.origin_city,
    ar.sector,
    COUNT(*) as total_requests,
    ROUND(
      AVG(
        CASE 
          WHEN ar.confirmed_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (ar.confirmed_at - ar.created_at)) / 60
          ELSE NULL 
        END
      )::NUMERIC, 2
    ) as avg_response_time_minutes,
    COUNT(*) FILTER (WHERE ar.status = 'CONFIRMED') as confirmed_requests
  FROM public.ambulance_requests ar
  WHERE ar.vehicle_type = 'AMBULANCIA'
    AND ar.sector IS NOT NULL
    AND (p_start_date IS NULL OR ar.request_date >= p_start_date)
    AND (p_end_date IS NULL OR ar.request_date <= p_end_date)
  GROUP BY ar.origin_city, ar.sector
  ORDER BY ar.origin_city, ar.sector;
$$;

-- Atualizar função existente para usar created_at em vez de request_date + request_time
CREATE OR REPLACE FUNCTION public.get_ambulance_stats_by_city(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
  origin_city TEXT,
  total_requests BIGINT,
  avg_response_time_minutes NUMERIC,
  confirmed_requests BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    ar.origin_city,
    COUNT(*) as total_requests,
    ROUND(
      AVG(
        CASE 
          WHEN ar.confirmed_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (ar.confirmed_at - ar.created_at)) / 60
          ELSE NULL 
        END
      )::NUMERIC, 2
    ) as avg_response_time_minutes,
    COUNT(*) FILTER (WHERE ar.status = 'CONFIRMED') as confirmed_requests
  FROM public.ambulance_requests ar
  WHERE ar.vehicle_type = 'AMBULANCIA'
    AND (p_start_date IS NULL OR ar.request_date >= p_start_date)
    AND (p_end_date IS NULL OR ar.request_date <= p_end_date)
  GROUP BY ar.origin_city
  ORDER BY avg_response_time_minutes DESC NULLS LAST;
$$;
