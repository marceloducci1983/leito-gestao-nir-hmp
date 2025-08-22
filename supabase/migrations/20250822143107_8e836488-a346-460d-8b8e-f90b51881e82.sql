-- Segunda correção: Sincronizar corretamente os status dos leitos
-- Atualizar is_occupied baseado na presença de pacientes

UPDATE beds 
SET is_occupied = true, updated_at = NOW()
WHERE department_text = 'UTI ADULTO'
AND id IN (
    SELECT DISTINCT bed_id 
    FROM patients 
    WHERE department_text = 'UTI ADULTO'
    AND bed_id IS NOT NULL
);

UPDATE beds 
SET is_occupied = false, updated_at = NOW()
WHERE department_text = 'UTI ADULTO'
AND id NOT IN (
    SELECT DISTINCT bed_id 
    FROM patients 
    WHERE department_text = 'UTI ADULTO'
    AND bed_id IS NOT NULL
);

-- Verificar resultado final
SELECT 
    b.name as bed_name,
    b.is_occupied,
    COUNT(p.id) as patient_count,
    (b.is_occupied = (COUNT(p.id) > 0)) as status_consistent
FROM beds b
LEFT JOIN patients p ON b.id = p.bed_id
WHERE b.department_text = 'UTI ADULTO'
GROUP BY b.id, b.name, b.is_occupied
ORDER BY b.name;