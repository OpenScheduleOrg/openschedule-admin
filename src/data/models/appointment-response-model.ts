export type AppointmentResponseModel = {
  id: number;
  patient_id: string;
  acting_id: string;
  scheduled_day: string;
  start_time: number;
  end_time?: number;
  complaint?: string;
  prescription?: string;
};
