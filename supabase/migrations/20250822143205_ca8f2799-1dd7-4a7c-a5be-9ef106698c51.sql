-- CORREÇÃO FINAL - Limpeza de duplicações usando o campo department correto

-- 1. Limpar duplicações (manter apenas o registro mais recente por leito)
WITH duplicates_to_delete AS (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY bed_id ORDER BY created_at DESC, admission_date DESC) as rn
    FROM patients 
    WHERE department = 'UTI ADULTO'
)
DELETE FROM patients 
WHERE id IN (
    SELECT id FROM duplicates_to_delete WHERE rn > 1
);

-- 2. Sincronizar status is_occupied dos leitos usando o campo department correto
UPDATE beds 
SET is_occupied = true, updated_at = NOW()
WHERE (department_text = 'UTI ADULTO' OR department::text = 'UTI ADULTO')
AND id IN (
    SELECT DISTINCT bed_id 
    FROM patients 
    WHERE department = 'UTI ADULTO'
    AND bed_id IS NOT NULL
);

UPDATE beds 
SET is_occupied = false, updated_at = NOW()
WHERE (department_text = 'UTI ADULTO' OR department::text = 'UTI ADULTO')
AND id NOT IN (
    SELECT DISTINCT bed_id 
    FROM patients 
    WHERE department = 'UTI ADULTO'
    AND bed_id IS NOT NULL
);

-- 3. Verificar resultado final
SELECT 
    b.name as bed_name,
    b.is_occupied,
    COUNT(p.id) as patient_count,
    STRING_AGG(p.name, '; ') as patients,
    (b.is_occupied = (COUNT(p.id) > 0)) as status_consistent
FROM beds b
LEFT JOIN patients p ON b.id = p.bed_id AND p.department = 'UTI ADULTO'
WHERE (b.department_text = 'UTI ADULTO' OR b.department::text = 'UTI ADULTO')
GROUP BY b.id, b.name, b.is_occupied
ORDER BY b.name;