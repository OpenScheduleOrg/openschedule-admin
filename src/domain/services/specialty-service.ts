import { HttpClient } from "@/data/http/http-client";
import { SpecialtyResponseModel } from "@/data/models";
import { SpecialtyModel } from "../models";
import { SpecialtyBody } from "../params";

export class SpecialtyService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: SpecialtyBody): Promise<SpecialtyModel> => {
    return await this.httpClient.post<SpecialtyResponseModel>("/specialties", {
      body,
    });
  };

  update = async (id: number, body: SpecialtyBody): Promise<SpecialtyModel> => {
    return await this.httpClient.put<SpecialtyResponseModel>(
      `/specialties/${id}`,
      { body }
    );
  };

  load = async (): Promise<SpecialtyModel[]> => {
    return await this.httpClient.get<SpecialtyResponseModel[]>("/specialties");
  };

  getById = async (id: number): Promise<SpecialtyModel> => {
    return await this.httpClient.get<SpecialtyResponseModel>(
      `/specialties/${id}`
    );
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/specialties/${id}`);
  };
}
