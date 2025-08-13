-- Fix security warnings: Add SET search_path = 'public' to all functions
-- This addresses "Function Search Path Mutable" security warnings

-- Fix request_discharge_for_patient function
ALTER FUNCTION public.request_discharge_for_patient(uuid, text, text, text)
SET search_path = 'public';

-- Fix cancel_discharge_and_restore_patient function
ALTER FUNCTION public.cancel_discharge_and_restore_patient(uuid)
SET search_path = 'public';

-- Fix calculate_occupation_days function
ALTER FUNCTION public.calculate_occupation_days(date)
SET search_path = 'public';

-- Fix update_occupation_days function
ALTER FUNCTION public.update_occupation_days()
SET search_path = 'public';

-- Fix update_all_occupation_days function
ALTER FUNCTION public.update_all_occupation_days()
SET search_path = 'public';

-- Fix confirm_ambulance_transport function
ALTER FUNCTION public.confirm_ambulance_transport(uuid)
SET search_path = 'public';

-- Fix cancel_ambulance_transport function
ALTER FUNCTION public.cancel_ambulance_transport(uuid)
SET search_path = 'public';

-- Fix is_admin function
ALTER FUNCTION public.is_admin(uuid)
SET search_path = 'public';

-- Fix complete_discharge_and_remove_patient function
ALTER FUNCTION public.complete_discharge_and_remove_patient(uuid, text)
SET search_path = 'public';

-- Fix get_ambulance_stats_by_city function
ALTER FUNCTION public.get_ambulance_stats_by_city(date, date)
SET search_path = 'public';

-- Fix create_bed function
ALTER FUNCTION public.create_bed(text, text)
SET search_path = 'public';

-- Fix update_bed function
ALTER FUNCTION public.update_bed(uuid, text, text)
SET search_path = 'public';

-- Fix get_ambulance_stats_by_city_and_sector function
ALTER FUNCTION public.get_ambulance_stats_by_city_and_sector(date, date)
SET search_path = 'public';

-- Fix get_discharge_time_stats_by_department function
ALTER FUNCTION public.get_discharge_time_stats_by_department(date, date)
SET search_path = 'public';

-- Fix get_discharge_time_stats_by_city function
ALTER FUNCTION public.get_discharge_time_stats_by_city(date, date)
SET search_path = 'public';

-- Fix update_department function
ALTER FUNCTION public.update_department(uuid, text, text)
SET search_path = 'public';

-- Fix enum_value_exists function
ALTER FUNCTION public.enum_value_exists(text, text)
SET search_path = 'public';

-- Fix add_department_type function
ALTER FUNCTION public.add_department_type(text)
SET search_path = 'public';

-- Fix get_all_departments function
ALTER FUNCTION public.get_all_departments()
SET search_path = 'public';

-- Fix create_department function
ALTER FUNCTION public.create_department(text, text)
SET search_path = 'public';

-- Fix delete_department function
ALTER FUNCTION public.delete_department(uuid)
SET search_path = 'public';

-- Fix update_department_bed_counts function
ALTER FUNCTION public.update_department_bed_counts()
SET search_path = 'public';

-- Fix update_department_counters function
ALTER FUNCTION public.update_department_counters()
SET search_path = 'public';

-- Fix get_readmissions_within_30_days function
ALTER FUNCTION public.get_readmissions_within_30_days()
SET search_path = 'public';

-- Fix get_department_stats function
ALTER FUNCTION public.get_department_stats()
SET search_path = 'public';

-- Fix get_average_discharge_time_by_department function
ALTER FUNCTION public.get_average_discharge_time_by_department()
SET search_path = 'public';

-- Fix get_delayed_discharges function
ALTER FUNCTION public.get_delayed_discharges()
SET search_path = 'public';