
-- Remover as duas entradas duplicadas do setor UTI PEDIATRICA
-- Primeira entrada (ID: 87f8f70e-f8c3-499a-8f5e-8f43c665cb29)
SELECT delete_department('87f8f70e-f8c3-499a-8f5e-8f43c665cb29');

-- Segunda entrada (ID: 05f6f07a-b414-4cc9-8369-81a106ebe117)
SELECT delete_department('05f6f07a-b414-4cc9-8369-81a106ebe117');

-- Verificar se a remoção foi bem-sucedida
SELECT id, COALESCE(name_text, name::text) as name, description, total_beds
FROM departments 
WHERE UPPER(COALESCE(name_text, name::text)) LIKE '%UTI PEDIATRICA%'
ORDER BY COALESCE(name_text, name::text);
