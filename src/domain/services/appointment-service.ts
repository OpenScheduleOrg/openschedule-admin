import { HttpClient } from "@/data/http/http-client";
import { AppointmentResponseModel } from "@/data/models";
import { AppointmentModel } from "../models";
import { AppointmentBody, AppointmentFilter } from "../params";

export class AppointmentService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: AppointmentBody): Promise<AppointmentModel> => {
    return await this.httpClient.post<AppointmentResponseModel>(
      "/appointments",
      { body }
    );
  };

  update = async (
    id: number,
    body: AppointmentBody
  ): Promise<AppointmentModel> => {
    return await this.httpClient.put<AppointmentResponseModel>(
      `/appointments/${id}`,
      { body }
    );
  };

  load = async (filters?: AppointmentFilter): Promise<AppointmentModel[]> => {
    return await this.httpClient.get<AppointmentResponseModel[]>(
      "/appointments",
      { params: filters }
    );
  };

  getById = async (id: number): Promise<AppointmentModel> => {
    return await this.httpClient.get<AppointmentResponseModel>(
      `/appointments/${id}`
    );
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/appointments/${id}`);
  };
}
