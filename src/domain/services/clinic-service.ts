import { HttpClient } from "@/data/http/http-client";
import { ClinicModel } from "../models";
import { ClinicBody, ClinicFilter } from "../params";

export class ClinicService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ClinicBody): Promise<ClinicModel> => {
    return await this.httpClient.post("/clinics", { body });
  };

  update = async (id: number, body: ClinicBody): Promise<ClinicModel> => {
    return await this.httpClient.put(`/clinics/${id}`, { body });
  };

  load = async (filters?: ClinicFilter): Promise<ClinicModel[]> => {
    return await this.httpClient.get("/clinics", { params: filters });
  };

  getById = async (id: number): Promise<ClinicModel> => {
    return await this.httpClient.get(`/clinics/${id}`);
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/clinics/${id}`);
  };
}
