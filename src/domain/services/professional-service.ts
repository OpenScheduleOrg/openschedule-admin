import { HttpClient } from "@/data/http/http-client";
import { ProfessionalResponseModel } from "@/data/models";
import { ProfessionalModel } from "../models";
import { ProfessionalBody, ProfessionalFilter } from "../params";

export class ProfessionalService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: ProfessionalBody): Promise<ProfessionalModel> => {
    return await this.httpClient.post<ProfessionalResponseModel>(
      "/professionals",
      { body }
    );
  };

  update = async (
    id: number,
    body: ProfessionalBody
  ): Promise<ProfessionalModel> => {
    return await this.httpClient.put<ProfessionalResponseModel>(
      `/professionals/${id}`,
      { body }
    );
  };

  load = async (filters?: ProfessionalFilter): Promise<ProfessionalModel[]> => {
    return await this.httpClient.get<ProfessionalResponseModel[]>(
      "/professionals",
      { params: filters }
    );
  };

  getById = async (id: number): Promise<ProfessionalModel> => {
    return await this.httpClient.get<ProfessionalResponseModel>(
      `/professionals/${id}`
    );
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/professionals/${id}`);
  };
}
