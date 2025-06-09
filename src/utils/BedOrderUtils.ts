
import { Department, Bed } from '@/types';

// Ordem específica dos leitos por departamento
export const BED_ORDER_BY_DEPARTMENT: Record<Department, string[]> = {
  'CLINICA MEDICA': [
    'ISOL', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '4A', '4B', 
    '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', 
    '11A', '11B', '12A', '12B', '13A', '13B', '14A', '14B', '14C', '14D', 
    '15A', '15B', '15C', '16A', '16B', '16C', '17A', '17B', '17C', '18'
  ],
  'PRONTO SOCORRO': [
    '1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '2E', 
    '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', 
    'Isolamento', 'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', 'BOX-5', 
    'CI-1', 'CI-2', 'CI-3', 'CI-4'
  ],
  'CLINICA CIRURGICA': [
    '1A – ORTOP', '1B – ORTOP', '1C – ORTOP', '2A – ORTOP', '2B – ORTOP', '2C – ORTOP',
    '3A – ORTOP', '3B – ORTOP', '4A – CIRUR', '4B – CIRUR', '5A – CIRUR', '5B – CIRUR',
    '7A – CIRUR', '7B – CIRUR', '7C – CIRUR', '8A – ORTOP', '8B – ORTOP', '8C – ORTOP',
    '9A – CIRUR', '9B – CIRUR', '9C – CIRUR', '10A – PED', '10B – PED',
    '11A – CIRUR', '11B – CIRUR', '11C – CIRUR', 'Isolamento'
  ],
  'UTI ADULTO': [
    'BOX - 1', 'BOX - 2', 'BOX - 3', 'BOX - 4', 'BOX - 5', 'BOX - 6',
    'BOX - 7', 'BOX - 8', 'BOX - 9', 'BOX - 10', 'BOX - 11', 'BOX - 12',
    'BOX - 13', 'BOX - 14', 'BOX – 15 - ISOL', 'BOX – 16 – ISOL'
  ],
  'UTI NEONATAL': [
    '1A', '1B', '1C', '1D', 'Canguru-2A', 'Canguru-2B', 'Convencional 1', 'Convencional 2'
  ],
  'PEDIATRIA': [
    'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', '1A', '1B', '1C', '1D', 
    '2A', '2B', '2C', '2D', '2E', '3A', '3B', '3C', '3D', 
    '4A', '4B', '4C', '4D', '5A', '5B', '5C', 'Isolamento'
  ],
  'MATERNIDADE': [
    '1A', '1B', '2A', '2B', '4A', '4B', '5A', '5B', '6A', '6B', 
    '7A', '7B', '9A', '9B', '9C', '10A', '10B', '10C', '11A', '11B', '11C', 
    'ISOL', 'Ind. A', 'Ind. B', 'BOX-A', 'CI-A', 'CI-B', 'PP-1', 'PP-2', 'PP-3'
  ]
};

// Função para ordenar leitos conforme a ordem customizada
export const sortBedsByCustomOrder = (beds: Bed[], department: Department): Bed[] => {
  const orderArray = BED_ORDER_BY_DEPARTMENT[department] || [];
  
  return beds.sort((a, b) => {
    const indexA = orderArray.indexOf(a.name);
    const indexB = orderArray.indexOf(b.name);
    
    // Se ambos estão na lista de ordem definida, ordena pela posição na lista
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // Se apenas A está na lista, A vem primeiro
    if (indexA !== -1 && indexB === -1) {
      return -1;
    }
    
    // Se apenas B está na lista, B vem primeiro
    if (indexA === -1 && indexB !== -1) {
      return 1;
    }
    
    // Se nenhum está na lista, ordena alfabeticamente
    return a.name.localeCompare(b.name);
  });
};
