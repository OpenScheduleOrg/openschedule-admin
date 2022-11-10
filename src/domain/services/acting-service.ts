import { HttpClient } from "@/data/http/http-client";
import { ActingModel } from "../models";
import { ActingBody, ActingFilter } from "../params";

export class ActingService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ActingBody): Promise<ActingModel> => {
    return await this.httpClient.post("/actuations", { body });
  };

  update = async (id: number, body: ActingBody): Promise<ActingModel> => {
    return await this.httpClient.put(`/actuations/${id}`, { body });
  };

  load = async (filters?: ActingFilter): Promise<ActingModel[]> => {
    return await this.httpClient.get("/actuations", { params: filters });
  };

  getById = async (id: number): Promise<ActingModel> => {
    return await this.httpClient.get(`/actuations/${id}`);
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/actuations/${id}`);
  };
}
