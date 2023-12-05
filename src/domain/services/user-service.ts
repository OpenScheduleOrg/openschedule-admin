import { HttpClient } from "@/data/http/http-client";
import { UserResponseModel } from "@/data/models";
import { UserModel } from "../models";
import { UserBody, UserFilter } from "../params";

export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  create = async (body: UserBody): Promise<UserModel> => {
    const user = await this.httpClient.post<UserResponseModel>(
      "/users",
      {
        body,
      }
    );

    return user;
  };

  update = async (id: number, body: UserBody): Promise<UserModel> => {
    const user = await this.httpClient.put<UserResponseModel>(
      `/users/${id}`,
      { body }
    );

    return user;
  };

  load = async (filters?: UserFilter): Promise<UserModel[]> => {
    const users = await this.httpClient.get<UserResponseModel[]>(
      "/users",
      {
        params: filters,
      }
    );

    return users;
  };

  getById = async (id: number): Promise<UserModel> => {
    const user = await this.httpClient.get<UserResponseModel>(
      `/users/${id}`
    );

    return user;
  };

  deleteById = async (id: number): Promise<void> => {
    await this.httpClient.delete(`/users/${id}`);
  };
}
