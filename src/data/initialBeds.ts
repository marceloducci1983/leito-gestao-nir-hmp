
import { Bed } from '@/types';

export const getInitialBeds = (): Bed[] => {
  const beds: Bed[] = [];

  // CLINICA MEDICA
  const clinicaMedicaBeds = [
    'ISOL', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '4A', '4B',
    '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B',
    '11A', '11B', '12A', '12B', '13A', '13B', '14A', '14B', '14C', '14D',
    '15A', '15B', '15C', '16A', '16B', '16C', '17A', '17B', '17C', '18'
  ];

  clinicaMedicaBeds.forEach(bedName => {
    beds.push({
      id: `CM-${bedName}`,
      name: bedName,
      department: 'CLINICA MEDICA',
      isOccupied: false,
      isReserved: false
    });
  });

  // PRONTO SOCORRO
  const prontoSocorroBeds = [
    '1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '2E',
    '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D',
    '5A', '5B', '5C', 'Isolamento', 'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', 'BOX-5',
    'CI-1', 'CI-2', 'CI-3', 'CI-4'
  ];

  prontoSocorroBeds.forEach(bedName => {
    beds.push({
      id: `PS-${bedName}`,
      name: bedName,
      department: 'PRONTO SOCORRO',
      isOccupied: false,
      isReserved: false
    });
  });

  // CLINICA CIRURGICA - ATUALIZADA COM NOVOS LEITOS
  const clinicaCirurgicaBeds = [
    '1A – ORTOP', '1B – ORTOP', '1C – ORTOP', '2A – ORTOP', '2B – ORTOP', '2C – ORTOP',
    '3A – ORTOP', '3B – ORTOP', '4A – CIRUR', '4B – CIRUR', '5A – CIRUR', '5B – CIRUR',
    '7A – CIRUR', '7B – CIRUR', '7C – CIRUR', '8A – ORTOP', '8B – ORTOP', '8C – ORTOP',
    '9A – CIRUR', '9B – CIRUR', '9C – CIRUR', '10A – PED', '10B – PED',
    '11A – CIRUR', '11B – CIRUR', '11C – CIRUR', 'Isolamento', 'CELA 1A', 'CELA 1B'
  ];

  clinicaCirurgicaBeds.forEach(bedName => {
    beds.push({
      id: `CC-${bedName}`,
      name: bedName,
      department: 'CLINICA CIRURGICA',
      isOccupied: false,
      isReserved: false
    });
  });

  // UTI ADULTO
  const utiAdultoBeds = [
    'BOX-1', 'BOX-2', 'BOX-3', 'BOX-4', 'BOX-5', 'BOX-6', 'BOX-7', 'BOX-8',
    'BOX-9', 'BOX-10', 'BOX-11', 'BOX-12', 'BOX-13', 'BOX-14', 'BOX-15-ISOL', 'BOX-16-ISOL'
  ];

  utiAdultoBeds.forEach(bedName => {
    beds.push({
      id: `UTI-ADULTO-${bedName}`,
      name: bedName,
      department: 'UTI ADULTO',
      isOccupied: false,
      isReserved: false
    });
  });

  // UTI NEONATAL - NOVOS LEITOS
  const utiNeonatalBeds = [
    'UTIN-1', 'UTIN-2', 'UTIN-3', 'UTIN-4', 'UCON-1', 'UCON-2', 'UCON-3', 'UCON-4', 'Canguru-1A', 'Canguru-1B'
  ];

  utiNeonatalBeds.forEach(bedName => {
    beds.push({
      id: `UTI-NEO-${bedName}`,
      name: bedName,
      department: 'UTI NEONATAL',
      isOccupied: false,
      isReserved: false
    });
  });

  // PEDIATRIA
  const pediatriaBeds = [
    'BOX-1', 'BOX-2', 'BOX-3', '1A', '1B', '1C',
    '2A', '2B', '2C', '3A', '3B',
    '4A', '4B', 'Isolamento'
  ];

  pediatriaBeds.forEach(bedName => {
    beds.push({
      id: `PED-${bedName}`,
      name: bedName,
      department: 'PEDIATRIA',
      isOccupied: false,
      isReserved: false
    });
  });

  // MATERNIDADE
  const maternidadeBeds = [
    '1A', '1B', '2A', '2B', '4A', '4B', '5A', '5B', '6A', '6B',
    '7A', '7B', '9A', '9B', '9C', '10A', '10B', '10C',
    '11A', '11B', '11C', 'ISOL', 'Ind. A', 'Ind. B', 'BOX-A',
    'CI-A', 'CI-B', 'PP-1', 'PP-2', 'PP-3'
  ];

  maternidadeBeds.forEach(bedName => {
    beds.push({
      id: `MAT-${bedName}`,
      name: bedName,
      department: 'MATERNIDADE',
      isOccupied: false,
      isReserved: false
    });
  });

  return beds;
};
