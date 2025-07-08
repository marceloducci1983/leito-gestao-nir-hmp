-- Corrigir função get_all_departments para retornar formato JSON correto
CREATE OR REPLACE FUNCTION public.get_all_departments()
 RETURNS TABLE(id uuid, name text, description text, total_beds integer, occupied_beds integer, reserved_beds integer)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT 
    d.id,
    COALESCE(d.name_text, d.name::text) as name,
    d.description,
    d.total_beds::integer,
    d.occupied_beds::integer,
    d.reserved_beds::integer
  FROM public.departments d
  ORDER BY COALESCE(d.name_text, d.name::text);
$function$;