export type DayAppointment = {
  key: string;
  height: number;
  appointment_id?: number;
  start_time: number;
  end_time?: number;
  specialty?: string;
  patient?: string;
};

export type DaySchedule = DayAppointment & {
  schedule_id?: number;
  date?: Date;
  appointments?: DayAppointment[];
  max_visits?: number;
};

export type WeekDaySchedules = {
  [wkd: number]: DaySchedule[];
};
