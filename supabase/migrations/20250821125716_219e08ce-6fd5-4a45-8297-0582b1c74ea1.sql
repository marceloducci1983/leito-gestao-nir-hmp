-- Update bed names from UCON to UCINCo in UTI NEONATAL
UPDATE beds 
SET name = CASE 
    WHEN name = 'UCON-1' THEN 'UCINCo-5'
    WHEN name = 'UCON-2' THEN 'UCINCo-6'
    WHEN name = 'UCON-3' THEN 'UCINCo-7'
    WHEN name = 'UCON-4' THEN 'UCINCo-8'
    ELSE name
END
WHERE department = 'UTI NEONATAL' 
AND name IN ('UCON-1', 'UCON-2', 'UCON-3', 'UCON-4');