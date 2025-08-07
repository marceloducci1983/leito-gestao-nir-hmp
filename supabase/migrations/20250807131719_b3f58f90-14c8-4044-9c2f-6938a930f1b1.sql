-- Remover leito 3C da PEDIATRIA
DELETE FROM public.beds 
WHERE name = '3C' 
AND COALESCE(department_text, department::text) = 'PEDIATRIA';