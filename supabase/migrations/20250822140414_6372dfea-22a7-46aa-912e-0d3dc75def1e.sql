-- PLANO DE CORREÇÃO DOS DADOS UTI ADULTO
-- FASE 1: Limpeza de Duplicações

-- Criar uma função temporária para identificar duplicatas
CREATE OR REPLACE FUNCTION clean_uti_adulto_duplicates()
RETURNS void AS $$
DECLARE
    duplicate_record RECORD;
    bed_record RECORD;
BEGIN
    -- Log início da operação
    RAISE LOG 'Iniciando limpeza de duplicatas na UTI ADULTO';
    
    -- 1. Para cada leito, manter apenas o paciente mais recente
    FOR bed_record IN 
        SELECT bed_id, COUNT(*) as patient_count
        FROM patients 
        WHERE department_text = 'UTI ADULTO'
        GROUP BY bed_id
        HAVING COUNT(*) > 1
    LOOP
        RAISE LOG 'Limpando leito % com % pacientes', bed_record.bed_id, bed_record.patient_count;
        
        -- Deletar todos os registros exceto o mais recente para este leito
        DELETE FROM patients 
        WHERE bed_id = bed_record.bed_id 
        AND department_text = 'UTI ADULTO'
        AND id NOT IN (
            SELECT id FROM patients 
            WHERE bed_id = bed_record.bed_id 
            AND department_text = 'UTI ADULTO'
            ORDER BY created_at DESC, admission_date DESC 
            LIMIT 1
        );
        
        RAISE LOG 'Leito % limpo', bed_record.bed_id;
    END LOOP;
    
    -- 2. Sincronizar status is_occupied dos leitos
    RAISE LOG 'Sincronizando status dos leitos';
    
    -- Atualizar is_occupied = true para leitos com pacientes
    UPDATE beds 
    SET is_occupied = true, updated_at = NOW()
    WHERE department_text = 'UTI ADULTO'
    AND id IN (
        SELECT DISTINCT bed_id 
        FROM patients 
        WHERE department_text = 'UTI ADULTO'
        AND bed_id IS NOT NULL
    );
    
    -- Atualizar is_occupied = false para leitos sem pacientes
    UPDATE beds 
    SET is_occupied = false, updated_at = NOW()
    WHERE department_text = 'UTI ADULTO'
    AND id NOT IN (
        SELECT DISTINCT bed_id 
        FROM patients 
        WHERE department_text = 'UTI ADULTO'
        AND bed_id IS NOT NULL
    );
    
    RAISE LOG 'Correção concluída com sucesso';
END;
$$ LANGUAGE plpgsql;

-- Executar a função de limpeza
SELECT clean_uti_adulto_duplicates();

-- Remover a função temporária
DROP FUNCTION clean_uti_adulto_duplicates();

-- FASE 2: Adicionar constraint para prevenir futuras duplicações
-- Criar índice único para prevenir múltiplos pacientes no mesmo leito
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_unique_patient_per_bed 
ON patients (bed_id) 
WHERE bed_id IS NOT NULL;

-- FASE 3: Função de validação para auditoria
CREATE OR REPLACE FUNCTION validate_bed_patient_consistency()
RETURNS TABLE(
    bed_id uuid,
    bed_name text,
    is_occupied boolean,
    patient_count bigint,
    status_consistent boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id as bed_id,
        b.name as bed_name,
        b.is_occupied,
        COUNT(p.id) as patient_count,
        (b.is_occupied = (COUNT(p.id) > 0)) as status_consistent
    FROM beds b
    LEFT JOIN patients p ON b.id = p.bed_id
    WHERE b.department_text = 'UTI ADULTO'
    GROUP BY b.id, b.name, b.is_occupied
    ORDER BY b.name;
END;
$$ LANGUAGE plpgsql;

-- Executar validação final
SELECT * FROM validate_bed_patient_consistency();