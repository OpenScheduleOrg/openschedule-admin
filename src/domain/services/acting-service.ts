import { HttpClient } from "@/data/http/http-client";
import { ActingResponseModel } from "@/data/models";
import { ActingModel } from "../models";
import { ActingBody, ActingFilter } from "../params";

export class ActingService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ActingBody): Promise<ActingModel> => {
    return await this.httpClient.post<ActingResponseModel>("/actuations", {
      body,
    });
  };

  update = async (id: number, body: ActingBody): Promise<ActingModel> => {
    return await this.httpClient.put<ActingResponseModel>(`/actuations/${id}`, {
      body,
    });
  };

  load = async (filters?: ActingFilter): Promise<ActingModel[]> => {
    return await this.httpClient.get<ActingResponseModel[]>("/actuations", {
      params: filters,
    });
  };

  getById = async (id: number): Promise<ActingModel> => {
    return await this.httpClient.get<ActingResponseModel>(`/actuations/${id}`);
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/actuations/${id}`);
  };
}
