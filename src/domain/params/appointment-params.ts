export type AppointmentBody = {
  acting_id?: number;
  patient_id?: number;
  complaint?: string;
  prescription?: string;
  scheduled_day?: Date;
  start_time?: number;
  end_time?: number;
};

export type AppointmentFilter = {
  start_date?: Date;
  end_date?: Date;
  acting_id?: number;
  professional_id?: number;
  clinic_id?: number;
  specialty_id?: number;
};
