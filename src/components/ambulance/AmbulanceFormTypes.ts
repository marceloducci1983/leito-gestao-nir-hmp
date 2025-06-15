
export interface AmbulanceFormData {
  patient_name: string;
  sector: string;
  bed: string;
  is_puerpera: boolean;
  appropriate_crib: boolean;
  mobility: 'DEITADO' | 'SENTADO';
  vehicle_type: 'AMBULANCIA' | 'CARRO_COMUM';
  vehicle_subtype: 'BASICA' | 'AVANCADA' | undefined;
  origin_city: string;
  request_date: string;
  request_time: string;
  contact: string;
}

export const initialFormData: AmbulanceFormData = {
  patient_name: '',
  sector: '',
  bed: '',
  is_puerpera: false,
  appropriate_crib: false,
  mobility: 'DEITADO',
  vehicle_type: 'AMBULANCIA',
  vehicle_subtype: 'BASICA',
  origin_city: '',
  request_date: '',
  request_time: '',
  contact: ''
};
