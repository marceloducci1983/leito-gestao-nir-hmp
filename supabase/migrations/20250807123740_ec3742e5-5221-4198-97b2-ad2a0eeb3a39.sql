-- Remover leitos específicos da PEDIATRIA
DELETE FROM public.beds 
WHERE name IN ('BOX-4', '1D', '2D', '2E', '4D', '5A', '5B', '5C') 
AND COALESCE(department_text, department::text) = 'PEDIATRIA';