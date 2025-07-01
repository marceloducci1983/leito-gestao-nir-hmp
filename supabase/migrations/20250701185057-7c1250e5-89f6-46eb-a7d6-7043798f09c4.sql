
-- Atualizar os leitos da UTI NEONATAL para os novos nomes
-- Primeiro, vamos verificar se existem pacientes ou reservas nos leitos atuais

-- Atualizar os nomes dos leitos na tabela beds
UPDATE public.beds 
SET name = CASE 
  WHEN name = '1A' AND department = 'UTI NEONATAL' THEN 'UTIN-1'
  WHEN name = '1B' AND department = 'UTI NEONATAL' THEN 'UTIN-2'
  WHEN name = '1C' AND department = 'UTI NEONATAL' THEN 'UTIN-3'
  WHEN name = '1D' AND department = 'UTI NEONATAL' THEN 'UTIN-4'
  WHEN name = 'Canguru-2A' AND department = 'UTI NEONATAL' THEN 'UCON-1'
  WHEN name = 'Canguru-2B' AND department = 'UTI NEONATAL' THEN 'UCON-2'
  WHEN name = 'Convencional 1' AND department = 'UTI NEONATAL' THEN 'UCON-3'
  WHEN name = 'Convencional 2' AND department = 'UTI NEONATAL' THEN 'UCON-4'
  ELSE name
END
WHERE department = 'UTI NEONATAL';

-- Inserir os novos leitos Canguru se não existirem
INSERT INTO public.beds (name, department, is_occupied, is_reserved, is_custom)
SELECT 'Canguru-1A', 'UTI NEONATAL', false, false, false
WHERE NOT EXISTS (SELECT 1 FROM public.beds WHERE name = 'Canguru-1A' AND department = 'UTI NEONATAL');

INSERT INTO public.beds (name, department, is_occupied, is_reserved, is_custom)
SELECT 'Canguru-1B', 'UTI NEONATAL', false, false, false
WHERE NOT EXISTS (SELECT 1 FROM public.beds WHERE name = 'Canguru-1B' AND department = 'UTI NEONATAL');

-- Atualizar referências na tabela de pacientes se houver
UPDATE public.patients 
SET bed_id = (
  SELECT id FROM public.beds 
  WHERE name = CASE 
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = '1A' THEN 'UTIN-1'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = '1B' THEN 'UTIN-2'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = '1C' THEN 'UTIN-3'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = '1D' THEN 'UTIN-4'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = 'Canguru-2A' THEN 'UCON-1'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = 'Canguru-2B' THEN 'UCON-2'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = 'Convencional 1' THEN 'UCON-3'
    WHEN (SELECT name FROM public.beds WHERE id = patients.bed_id) = 'Convencional 2' THEN 'UCON-4'
  END AND department = 'UTI NEONATAL'
  LIMIT 1
)
WHERE department = 'UTI NEONATAL' AND bed_id IN (
  SELECT id FROM public.beds 
  WHERE department = 'UTI NEONATAL' 
  AND name IN ('1A', '1B', '1C', '1D', 'Canguru-2A', 'Canguru-2B', 'Convencional 1', 'Convencional 2')
);

-- Atualizar referências na tabela de reservas se houver
UPDATE public.bed_reservations 
SET bed_id = (
  SELECT id FROM public.beds 
  WHERE name = CASE 
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = '1A' THEN 'UTIN-1'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = '1B' THEN 'UTIN-2'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = '1C' THEN 'UTIN-3'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = '1D' THEN 'UTIN-4'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = 'Canguru-2A' THEN 'UCON-1'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = 'Canguru-2B' THEN 'UCON-2'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = 'Convencional 1' THEN 'UCON-3'
    WHEN (SELECT name FROM public.beds WHERE id = bed_reservations.bed_id) = 'Convencional 2' THEN 'UCON-4'
  END AND department = 'UTI NEONATAL'
  LIMIT 1
)
WHERE department = 'UTI NEONATAL' AND bed_id IN (
  SELECT id FROM public.beds 
  WHERE department = 'UTI NEONATAL' 
  AND name IN ('1A', '1B', '1C', '1D', 'Canguru-2A', 'Canguru-2B', 'Convencional 1', 'Convencional 2')
);
