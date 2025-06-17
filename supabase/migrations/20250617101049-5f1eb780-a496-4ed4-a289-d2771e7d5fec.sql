
-- Remover o departamento UTI PEDIATRICA duplicado
-- Verificar se há leitos associados primeiro
SELECT COUNT(*) as bed_count 
FROM public.beds 
WHERE COALESCE(department_text, department::text) = 'UTI PEDIATRICA';

-- Se não houver leitos (esperado 0), proceder com a remoção
-- Buscar os IDs do departamento UTI PEDIATRICA
SELECT id, COALESCE(name_text, name::text) as name, total_beds
FROM public.departments 
WHERE UPPER(COALESCE(name_text, name::text)) = 'UTI PEDIATRICA';

-- Remover todas as entradas de UTI PEDIATRICA
DELETE FROM public.departments 
WHERE UPPER(COALESCE(name_text, name::text)) = 'UTI PEDIATRICA';
