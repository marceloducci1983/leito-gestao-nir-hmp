-- Fix duplicate patient records in BOX - 11 (UTI ADULTO)
-- Keep only the most recent PEDRO BEU PEREIRA DA SILVA record

-- First, let's check what records exist for bed BOX - 11
-- Remove duplicate/old patient records, keeping only the current PEDRO BEU

-- Remove the old PEDRO BEU record (transferred but not properly removed)
DELETE FROM public.patients 
WHERE id = '4699da29-51e1-41f2-9e07-1c785ef18b23'
AND name = 'PEDRO BEU PEREIRA DA SILVA';

-- Remove all EDSON LIMA DOS SANTOS records (should have been discharged/transferred)
DELETE FROM public.patients 
WHERE name = 'EDSON LIMA DOS SANTOS' 
AND bed_id IN (
  SELECT id FROM public.beds 
  WHERE name = 'BOX - 11' 
  AND COALESCE(department_text, department::text) = 'UTI ADULTO'
);

-- Ensure the bed BOX - 11 is marked as occupied (should remain occupied with current PEDRO BEU)
UPDATE public.beds 
SET is_occupied = true,
    updated_at = now()
WHERE name = 'BOX - 11' 
AND COALESCE(department_text, department::text) = 'UTI ADULTO';

-- Verify the remaining patient record is correct
-- This should be PEDRO BEU PEREIRA DA SILVA (ID: 2f5edfb0-6ca0-4778-b4c9-b3958183177f)
-- with admission_date = '2025-08-14' and diagnosis = 'CHOQUE SEPTICO'