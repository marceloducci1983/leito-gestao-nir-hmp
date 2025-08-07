-- Remover leito 4C da PEDIATRIA
DELETE FROM public.beds 
WHERE name = '4C' 
AND COALESCE(department_text, department::text) = 'PEDIATRIA';