-- FASE 1: CORREÇÃO IMEDIATA DOS DADOS - CLINICA MEDICA
-- Corrigir duplicações massivas e sincronizar status

-- 1. IDENTIFICAR E LIMPAR DUPLICAÇÕES (manter apenas o registro mais recente por leito)
WITH duplicates_to_delete AS (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY bed_id ORDER BY created_at DESC, admission_date DESC) as rn
    FROM patients 
    WHERE department = 'CLINICA MEDICA'
)
DELETE FROM patients 
WHERE id IN (
    SELECT id FROM duplicates_to_delete WHERE rn > 1
);

-- 2. SINCRONIZAR STATUS is_occupied DOS LEITOS
-- Atualizar para ocupado onde há pacientes
UPDATE beds 
SET is_occupied = true, updated_at = NOW()
WHERE (department_text = 'CLINICA MEDICA' OR department::text = 'CLINICA MEDICA')
AND id IN (
    SELECT DISTINCT bed_id 
    FROM patients 
    WHERE department = 'CLINICA MEDICA'
    AND bed_id IS NOT NULL
);

-- Atualizar para livre onde não há pacientes
UPDATE beds 
SET is_occupied = false, updated_at = NOW()
WHERE (department_text = 'CLINICA MEDICA' OR department::text = 'CLINICA MEDICA')
AND id NOT IN (
    SELECT DISTINCT bed_id 
    FROM patients 
    WHERE department = 'CLINICA MEDICA'
    AND bed_id IS NOT NULL
);

-- 3. FASE 2: IMPLEMENTAR CONTROLES DE INTEGRIDADE
-- Adicionar constraint UNIQUE para prevenir futuras duplicações
-- (Um paciente por leito)
ALTER TABLE patients 
ADD CONSTRAINT unique_patient_per_bed 
UNIQUE (bed_id) 
DEFERRABLE INITIALLY DEFERRED;

-- 4. CRIAR FUNÇÃO DE VALIDAÇÃO PARA ADMISSÕES
CREATE OR REPLACE FUNCTION validate_bed_admission()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o leito já está ocupado
  IF EXISTS (
    SELECT 1 FROM patients 
    WHERE bed_id = NEW.bed_id 
    AND id != COALESCE(NEW.id, gen_random_uuid())
  ) THEN
    RAISE EXCEPTION 'Leito já está ocupado. Não é possível admitir paciente.';
  END IF;
  
  -- Atualizar status do leito para ocupado
  UPDATE beds 
  SET is_occupied = true, updated_at = NOW() 
  WHERE id = NEW.bed_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. CRIAR TRIGGER PARA VALIDAÇÃO EM ADMISSÕES
DROP TRIGGER IF EXISTS trigger_validate_bed_admission ON patients;
CREATE TRIGGER trigger_validate_bed_admission
    BEFORE INSERT OR UPDATE ON patients
    FOR EACH ROW 
    WHEN (NEW.bed_id IS NOT NULL)
    EXECUTE FUNCTION validate_bed_admission();

-- 6. CRIAR FUNÇÃO PARA LIBERAR LEITO EM ALTAS/TRANSFERÊNCIAS
CREATE OR REPLACE FUNCTION release_bed_on_patient_removal()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar status do leito para livre se não há mais pacientes
  UPDATE beds 
  SET is_occupied = false, updated_at = NOW() 
  WHERE id = OLD.bed_id
  AND NOT EXISTS (
    SELECT 1 FROM patients 
    WHERE bed_id = OLD.bed_id
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 7. CRIAR TRIGGER PARA LIBERAR LEITO
DROP TRIGGER IF EXISTS trigger_release_bed_on_removal ON patients;
CREATE TRIGGER trigger_release_bed_on_removal
    AFTER DELETE ON patients
    FOR EACH ROW 
    WHEN (OLD.bed_id IS NOT NULL)
    EXECUTE FUNCTION release_bed_on_patient_removal();

-- 8. VERIFICAR RESULTADO FINAL
SELECT 
    b.name as bed_name,
    b.is_occupied,
    COUNT(p.id) as patient_count,
    STRING_AGG(p.name, '; ') as patients,
    (b.is_occupied = (COUNT(p.id) > 0)) as status_consistent
FROM beds b
LEFT JOIN patients p ON b.id = p.bed_id AND p.department = 'CLINICA MEDICA'
WHERE (b.department_text = 'CLINICA MEDICA' OR b.department::text = 'CLINICA MEDICA')
GROUP BY b.id, b.name, b.is_occupied
ORDER BY b.name;