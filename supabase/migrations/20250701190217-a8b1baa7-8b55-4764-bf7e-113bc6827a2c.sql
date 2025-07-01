
-- Adicionar os novos leitos CELA 1A e CELA 1B à CLÍNICA CIRÚRGICA
-- Os demais leitos já existem com os nomes corretos

INSERT INTO public.beds (name, department, is_occupied, is_reserved, is_custom)
SELECT 'CELA 1A', 'CLINICA CIRURGICA', false, false, false
WHERE NOT EXISTS (SELECT 1 FROM public.beds WHERE name = 'CELA 1A' AND department = 'CLINICA CIRURGICA');

INSERT INTO public.beds (name, department, is_occupied, is_reserved, is_custom)
SELECT 'CELA 1B', 'CLINICA CIRURGICA', false, false, false
WHERE NOT EXISTS (SELECT 1 FROM public.beds WHERE name = 'CELA 1B' AND department = 'CLINICA CIRURGICA');
