import { HttpClient } from "@/data/http/http-client";
import { ScheduleModel } from "../models";
import { ScheduleBody, ScheduleFilter } from "../params";

export class ScheduleService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ScheduleBody): Promise<ScheduleModel> => {
    return await this.httpClient.post("/schedules", { body });
  };

  update = async (id: number, body: ScheduleBody): Promise<ScheduleModel> => {
    return await this.httpClient.put(`/schedules/${id}`, { body });
  };

  load = async (filters?: ScheduleFilter): Promise<ScheduleModel[]> => {
    return await this.httpClient.get("/schedules", { params: filters });
  };

  getById = async (id: number): Promise<ScheduleModel> => {
    return await this.httpClient.get(`/schedules/${id}`);
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/schedules/${id}`);
  };
}
