
-- Função para calcular dias de ocupação em tempo real (corrigida)
CREATE OR REPLACE FUNCTION calculate_occupation_days(admission_date DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN (CURRENT_DATE - admission_date)::INTEGER;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger function para atualizar occupation_days automaticamente
CREATE OR REPLACE FUNCTION update_occupation_days()
RETURNS TRIGGER AS $$
BEGIN
  NEW.occupation_days = calculate_occupation_days(NEW.admission_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualização automática
DROP TRIGGER IF EXISTS trigger_update_occupation_days ON patients;
CREATE TRIGGER trigger_update_occupation_days
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_occupation_days();

-- Atualizar todos os registros existentes
UPDATE patients 
SET occupation_days = calculate_occupation_days(admission_date)
WHERE admission_date IS NOT NULL;

-- Criar função RPC para atualização manual (usada pelo hook de atualização)
CREATE OR REPLACE FUNCTION update_all_occupation_days()
RETURNS void AS $$
BEGIN
  UPDATE patients 
  SET occupation_days = calculate_occupation_days(admission_date)
  WHERE admission_date IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
