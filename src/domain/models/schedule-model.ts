export type ScheduleModel = {
  id: number;
  start_date: Date;
  end_date?: Date;
  start_time: number;
  end_time: number;
  max_visits: number;
  week_day: number;
  acting_id: number;
};
