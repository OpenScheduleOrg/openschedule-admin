export type AppointmentModel = {
  id: number;
  patient_id: string;
  acting_id: string;
  scheduled_day: Date;
  start_time: number;
  end_time?: number;
  complaint?: string;
  prescription?: string;
};
