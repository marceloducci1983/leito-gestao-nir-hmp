
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AmbulanceRequestCardHeader from './card/AmbulanceRequestCardHeader';
import AmbulanceRequestCardInfo from './card/AmbulanceRequestCardInfo';
import AmbulanceRequestCardActions from './card/AmbulanceRequestCardActions';

interface AmbulanceRequest {
  id: string;
  patient_name: string;
  sector?: string;
  bed?: string;
  is_puerpera: boolean;
  appropriate_crib?: boolean;
  mobility: string;
  vehicle_type: string;
  vehicle_subtype?: string;
  origin_city: string;
  request_date: string;
  request_time: string;
  status: string;
  confirmed_at?: string;
  cancelled_at?: string;
  created_at: string;
}

interface AmbulanceRequestCardProps {
  request: AmbulanceRequest;
}

const AmbulanceRequestCard: React.FC<AmbulanceRequestCardProps> = ({ request }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <AmbulanceRequestCardHeader
          patientName={request.patient_name}
          isPuerpera={request.is_puerpera}
          status={request.status}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <AmbulanceRequestCardInfo
          sector={request.sector}
          bed={request.bed}
          originCity={request.origin_city}
          vehicleType={request.vehicle_type}
          vehicleSubtype={request.vehicle_subtype}
          mobility={request.mobility}
          isPuerpera={request.is_puerpera}
          appropriateCrib={request.appropriate_crib}
          requestDate={request.request_date}
          requestTime={request.request_time}
        />

        <AmbulanceRequestCardActions
          requestId={request.id}
          status={request.status}
          createdAt={request.created_at}
          confirmedAt={request.confirmed_at}
          cancelledAt={request.cancelled_at}
        />
      </CardContent>
    </Card>
  );
};

export default AmbulanceRequestCard;
