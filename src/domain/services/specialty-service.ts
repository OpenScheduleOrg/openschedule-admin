import { HttpClient } from "@/data/http/http-client";
import { SpecialtyModel } from "../models";
import { SpecialtyBody } from "../params";

export class SpecialtyService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: SpecialtyBody): Promise<SpecialtyModel> => {
    return await this.httpClient.post("/specialties", { body });
  };

  update = async (id: number, body: SpecialtyBody): Promise<SpecialtyModel> => {
    return await this.httpClient.put(`/specialties/${id}`, { body });
  };

  load = async (): Promise<SpecialtyModel[]> => {
    return await this.httpClient.get("/specialties");
  };

  getById = async (id: number): Promise<SpecialtyModel> => {
    return await this.httpClient.get(`/specialties/${id}`);
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/specialties/${id}`);
  };
}
