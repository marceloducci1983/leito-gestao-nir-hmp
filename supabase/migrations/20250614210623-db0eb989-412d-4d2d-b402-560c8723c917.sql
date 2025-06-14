
-- Atualizar a constraint para aceitar 'readmission_30_days'
ALTER TABLE public.alert_investigations 
DROP CONSTRAINT IF EXISTS alert_investigations_alert_type_check;

-- Criar nova constraint que aceita os três tipos de alerta
ALTER TABLE public.alert_investigations 
ADD CONSTRAINT alert_investigations_alert_type_check 
CHECK (alert_type IN ('long_stay', 'readmission', 'readmission_30_days'));
