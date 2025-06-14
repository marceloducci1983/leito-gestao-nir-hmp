
-- Adicionar campo alert_key para identificar unicamente cada alerta
ALTER TABLE public.alert_investigations 
ADD COLUMN alert_key TEXT;

-- Criar índice único para o campo alert_key
CREATE UNIQUE INDEX idx_alert_investigations_alert_key 
ON public.alert_investigations(alert_key);

-- Atualizar registros existentes para gerar alert_key baseado nos dados atuais
UPDATE public.alert_investigations 
SET alert_key = CONCAT(alert_type, '_', patient_id) 
WHERE alert_key IS NULL;

-- Tornar o campo alert_key obrigatório após popular os dados existentes
ALTER TABLE public.alert_investigations 
ALTER COLUMN alert_key SET NOT NULL;
