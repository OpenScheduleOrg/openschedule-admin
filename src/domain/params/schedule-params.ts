export type ScheduleBody = {
  start_date?: Date;
  end_date?: Date;
  start_time?: number;
  end_time?: number;
  max_visits?: number;
  week_day?: number;
  acting_id?: number;
};

export type ScheduleFilter = {
  professional_id?: number;
  clinic_id?: number;
  specialty_id?: number;
};
