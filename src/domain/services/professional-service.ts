import { HttpClient } from "@/data/http/http-client";
import { ProfessionalModel } from "../models";
import { ProfessionalBody, ProfessionalFilter } from "../params";

export class ProfessionalService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ProfessionalBody): Promise<ProfessionalModel> => {
    return await this.httpClient.post("/professionals", { body });
  };

  update = async (
    id: number,
    body: ProfessionalBody
  ): Promise<ProfessionalModel> => {
    return await this.httpClient.put(`/professionals/${id}`, { body });
  };

  load = async (filters?: ProfessionalFilter): Promise<ProfessionalModel[]> => {
    return await this.httpClient.get("/professionals", { params: filters });
  };

  getById = async (id: number): Promise<ProfessionalModel> => {
    return await this.httpClient.get(`/professionals/${id}`);
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/professionals/${id}`);
  };
}
