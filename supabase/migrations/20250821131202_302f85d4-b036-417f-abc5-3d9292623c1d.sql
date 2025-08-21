-- Update Canguru bed names to UCIN Canguru in UTI NEONATAL
UPDATE beds 
SET name = CASE 
    WHEN name = 'Canguru-1A' THEN 'UCIN Canguru-9'
    WHEN name = 'Canguru-1B' THEN 'UCIN Canguru-10'
    ELSE name
END
WHERE department = 'UTI NEONATAL' 
AND name IN ('Canguru-1A', 'Canguru-1B');