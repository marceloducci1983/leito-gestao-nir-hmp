
-- Limpeza completa de dados de pacientes e históricos
-- Mantém toda a estrutura, apenas remove os dados de conteúdo

-- 1. Limpar dados de pacientes ativos
DELETE FROM public.patients;

-- 2. Limpar histórico de altas
DELETE FROM public.patient_discharges;

-- 3. Limpar histórico de transferências
DELETE FROM public.patient_transfers;

-- 4. Limpar controle de altas
DELETE FROM public.discharge_control;

-- 5. Limpar reservas de leitos
DELETE FROM public.bed_reservations;

-- 6. Limpar ocupações de leitos
DELETE FROM public.bed_occupations;

-- 7. Limpar solicitações de ambulância
DELETE FROM public.ambulance_requests;

-- 8. Limpar investigações de alertas
DELETE FROM public.alert_investigations;

-- 9. Limpar intervenções TFD
DELETE FROM public.tfd_interventions;

-- 10. Limpar arquivos TFD
DELETE FROM public.tfd_archives;

-- 11. Liberar todos os leitos (marcar como não ocupados e não reservados)
UPDATE public.beds 
SET 
  is_occupied = false,
  is_reserved = false,
  updated_at = now();

-- 12. Resetar contadores dos departamentos
UPDATE public.departments 
SET 
  occupied_beds = 0,
  reserved_beds = 0,
  updated_at = now();

-- 13. Atualizar total de leitos nos departamentos (manter a contagem real de leitos)
UPDATE public.departments 
SET total_beds = (
  SELECT COUNT(*) 
  FROM public.beds 
  WHERE COALESCE(department_text, department::text) = COALESCE(departments.name_text, departments.name::text)
);

-- Mensagem de confirmação
SELECT 
  'Limpeza completa realizada com sucesso!' as status,
  'Todos os dados de pacientes foram removidos' as pacientes,
  'Todos os leitos foram liberados' as leitos,
  'Estrutura do sistema preservada' as estrutura;
