-- Remover pacientes fictícios específicos
DELETE FROM public.patients 
WHERE name IN ('ROMÁRIO OLIVEIRA XAVIER', 'nir@paracatu.mg.gov.br''s Org');

-- Liberar os leitos que estavam ocupados por esses pacientes
UPDATE public.beds 
SET is_occupied = false, is_reserved = false 
WHERE id IN (
  SELECT bed_id FROM public.patients 
  WHERE name IN ('ROMÁRIO OLIVEIRA XAVIER', 'nir@paracatu.mg.gov.br''s Org')
);