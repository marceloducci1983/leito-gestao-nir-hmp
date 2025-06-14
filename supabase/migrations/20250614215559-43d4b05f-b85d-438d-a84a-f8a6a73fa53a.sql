
-- Criar tabela para solicitações de ambulância
CREATE TABLE public.ambulance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  is_puerpera BOOLEAN NOT NULL DEFAULT false,
  appropriate_crib BOOLEAN NULL,
  mobility TEXT NOT NULL CHECK (mobility IN ('DEITADO', 'SENTADO')),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('AMBULANCIA', 'CARRO_COMUM')),
  vehicle_subtype TEXT NULL CHECK (vehicle_subtype IN ('BASICA', 'AVANCADA')),
  origin_city TEXT NOT NULL,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_time TIME NOT NULL DEFAULT CURRENT_TIME,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  confirmed_at TIMESTAMP WITH TIME ZONE NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para confirmar transporte
CREATE OR REPLACE FUNCTION public.confirm_ambulance_transport(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.ambulance_requests 
  SET 
    status = 'CONFIRMED',
    confirmed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id AND status = 'PENDING';
  
  RETURN FOUND;
END;
$$;

-- Função para cancelar transporte
CREATE OR REPLACE FUNCTION public.cancel_ambulance_transport(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.ambulance_requests 
  SET 
    status = 'CANCELLED',
    cancelled_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id AND status = 'PENDING';
  
  RETURN FOUND;
END;
$$;

-- Função para estatísticas de tempo médio por município (apenas ambulâncias)
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
          THEN EXTRACT(EPOCH FROM (ar.confirmed_at - (ar.request_date + ar.request_time)::TIMESTAMP)) / 60
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

-- Inserir algumas cidades de exemplo de Minas Gerais para autocompletar
CREATE TABLE public.mg_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO public.mg_cities (name) VALUES 
('Belo Horizonte'),
('Uberlândia'),
('Contagem'),
('Juiz de Fora'),
('Betim'),
('Montes Claros'),
('Ribeirão das Neves'),
('Uberaba'),
('Governador Valadares'),
('Ipatinga'),
('Sete Lagoas'),
('Divinópolis'),
('Santa Luzia'),
('Ibirité'),
('Poços de Caldas'),
('Patos de Minas'),
('Pouso Alegre'),
('Teófilo Otoni'),
('Barbacena'),
('Sabará'),
('Varginha'),
('Conselheiro Lafaiete'),
('Vespasiano'),
('Itabira'),
('Araguari'),
('Passos'),
('Ubá'),
('Coronel Fabriciano'),
('Muriaé'),
('Ituiutaba'),
('Araxá'),
('Lavras'),
('Itajubá'),
('Açucena'),
('Timóteo'),
('Paracatu'),
('Pará de Minas'),
('Nova Lima'),
('Caratinga'),
('Nova Serrana'),
('São João del Rei'),
('Patrocínio'),
('Frutal'),
('Três Corações'),
('São Sebastião do Paraíso'),
('Cataguases'),
('Ouro Preto'),
('Janaúba'),
('São Francisco'),
('Viçosa'),
('Formiga'),
('Ponte Nova'),
('Mariana'),
('Visconde do Rio Branco'),
('Leopoldina'),
('Três Pontas'),
('João Monlevade'),
('Lagoa Santa'),
('Machado'),
('Porteirinha'),
('Congonhas'),
('São Lourenço'),
('Alfenas'),
('Boa Esperança'),
('Campo Belo'),
('Manhuaçu'),
('Oliveira'),
('Santos Dumont'),
('Januária'),
('Diamantina'),
('Curvelo'),
('Perdizes'),
('Carangola'),
('Conceição do Mato Dentro'),
('São Gotardo'),
('Espinosa'),
('Nepomuceno'),
('Pitangui'),
('São João Nepomuceno'),
('Salinas'),
('Bocaiúva'),
('Caeté'),
('Itaúna'),
('Bambuí'),
('Guaxupé'),
('Extrema'),
('Andradas'),
('Monte Carmelo'),
('São João da Ponte'),
('Nanuque'),
('Pirapora'),
('Buritis'),
('Rio Novo'),
('Carmo do Cajuru'),
('Esmeraldas'),
('Conceição da Aparecida'),
('Pedro Leopoldo'),
('Coronel Xavier Chaves'),
('Almenara'),
('Jacinto'),
('Rio Pardo de Minas'),
('São Romão'),
('Urucânia'),
('Capitólio'),
('Campo Florido'),
('São José da Lapa');
