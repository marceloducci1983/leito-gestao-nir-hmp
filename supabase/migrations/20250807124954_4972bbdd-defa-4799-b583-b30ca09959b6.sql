-- Remover leito 3D da PEDIATRIA
DELETE FROM public.beds 
WHERE name = '3D' 
AND COALESCE(department_text, department::text) = 'PEDIATRIA';