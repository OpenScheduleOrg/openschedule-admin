import { HttpClient } from "@/data/http/http-client";
import { ScheduleResponseModel } from "@/data/models";
import { ScheduleModel } from "../models";
import { ScheduleBody, ScheduleFilter } from "../params";

export class ScheduleService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ScheduleBody): Promise<ScheduleModel> => {
    const schedule = await this.httpClient.post<ScheduleResponseModel>(
      "/schedules",
      { body }
    );
    return {
      ...schedule,
      start_date: new Date(schedule.start_date),
      end_date: schedule.end_date ? new Date(schedule.end_date) : undefined,
    };
  };

  update = async (id: number, body: ScheduleBody): Promise<ScheduleModel> => {
    const schedule = await this.httpClient.put<ScheduleResponseModel>(
      `/schedules/${id}`,
      { body }
    );
    return {
      ...schedule,
      start_date: new Date(schedule.start_date),
      end_date: schedule.end_date ? new Date(schedule.end_date) : undefined,
    };
  };

  load = async (filters?: ScheduleFilter): Promise<ScheduleModel[]> => {
    const schedules = await this.httpClient.get<ScheduleResponseModel[]>(
      "/schedules",
      { params: filters }
    );

    return schedules.map((sc) => ({
      ...sc,
      start_date: new Date(sc.start_date),
      end_date: sc.end_date ? new Date(sc.end_date) : undefined,
    }));
  };

  getById = async (id: number): Promise<ScheduleModel> => {
    const schedule = await this.httpClient.get<ScheduleResponseModel>(
      `/schedules/${id}`
    );

    return {
      ...schedule,
      start_date: new Date(schedule.start_date),
      end_date: schedule.end_date ? new Date(schedule.end_date) : undefined,
    } as ScheduleModel;
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/schedules/${id}`);
  };
}
