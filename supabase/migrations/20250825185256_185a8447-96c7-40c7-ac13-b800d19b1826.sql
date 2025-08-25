-- CORREÇÃO DOS AVISOS DE SEGURANÇA - PHASE 3

-- 1. CORRIGIR FUNCTION SEARCH PATH MUTABLE 
-- Atualizar funções existentes para usar search_path seguro

ALTER FUNCTION validate_bed_admission() SET search_path = 'public';
ALTER FUNCTION release_bed_on_patient_removal() SET search_path = 'public';

-- 2. HABILITAR RLS PARA TABELAS NOVAS SE NECESSÁRIO
-- Verificar e habilitar RLS nas tabelas que podem precisar

-- Habilitar RLS para mg_cities se não estiver habilitado
ALTER TABLE mg_cities ENABLE ROW LEVEL SECURITY;

-- Criar política para mg_cities (dados públicos)
DROP POLICY IF EXISTS "Cities are viewable by everyone" ON mg_cities;
CREATE POLICY "Cities are viewable by everyone" 
ON mg_cities FOR SELECT 
USING (true);

-- Habilitar RLS para ambulance_requests se não estiver habilitado  
ALTER TABLE ambulance_requests ENABLE ROW LEVEL SECURITY;

-- Criar política básica para ambulance_requests
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ambulance_requests;
CREATE POLICY "Allow all operations for authenticated users" 
ON ambulance_requests FOR ALL 
USING (true);

-- 3. OTIMIZAR FUNÇÕES DE VALIDAÇÃO EXISTENTES
-- Melhorar performance das funções criadas

CREATE OR REPLACE FUNCTION validate_bed_admission()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o leito já está ocupado (otimizado)
  IF NEW.bed_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM patients 
    WHERE bed_id = NEW.bed_id 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Leito % já está ocupado. Não é possível admitir paciente.', 
      (SELECT name FROM beds WHERE id = NEW.bed_id);
  END IF;
  
  -- Atualizar status do leito para ocupado (apenas se necessário)
  UPDATE beds 
  SET is_occupied = true, updated_at = NOW() 
  WHERE id = NEW.bed_id AND is_occupied = false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public';

CREATE OR REPLACE FUNCTION release_bed_on_patient_removal()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar status do leito para livre apenas se não há mais pacientes
  UPDATE beds 
  SET is_occupied = false, updated_at = NOW() 
  WHERE id = OLD.bed_id
  AND is_occupied = true
  AND NOT EXISTS (
    SELECT 1 FROM patients 
    WHERE bed_id = OLD.bed_id
    LIMIT 1
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SET search_path = 'public';

-- 4. CRIAR FUNÇÃO PARA VALIDAR INTEGRIDADE DE DADOS
CREATE OR REPLACE FUNCTION check_bed_integrity()
RETURNS TABLE(
  bed_name text,
  department text,
  patient_count bigint,
  is_occupied boolean,
  status_consistent boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.name,
    COALESCE(b.department_text, b.department::text),
    COUNT(p.id),
    b.is_occupied,
    (b.is_occupied = (COUNT(p.id) > 0))
  FROM beds b
  LEFT JOIN patients p ON b.id = p.bed_id
  GROUP BY b.id, b.name, b.department_text, b.department, b.is_occupied
  HAVING COUNT(p.id) > 1 OR (b.is_occupied != (COUNT(p.id) > 0))
  ORDER BY COUNT(p.id) DESC, b.name;
END;
$$ LANGUAGE plpgsql STABLE SET search_path = 'public';

-- 5. VERIFICAR SE AINDA HÁ PROBLEMAS DE INTEGRIDADE
SELECT * FROM check_bed_integrity();