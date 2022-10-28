import axios, { Axios, AxiosError } from "axios";
import { AccessDeniedError } from "../errors/access-denied-error";
import { RequiredTokenError } from "../errors/requird-token-error";
import { ServerValidationError } from "../errors/server-validation-error";
import { UnexpectedError } from "../errors/unexpected-error";

type HttpRequest = {
  body?: any;
  params?: any;
  headers?: any;
};

export class AxiosHttpClient {
  axios: Axios;
  constructor(url: string) {
    this.axios = axios.create({
      baseURL: url,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  post = async <R>(url: string, request: HttpRequest): Promise<R> => {
    return this.axios
      .post<R>(url, request.body, {
        params: request.params,
        headers: request.headers,
      })
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        const res = error.response;
        console.error(error);

        if (res) {
          if (res.status == 401)
            return Promise.reject(new RequiredTokenError());
          if (res.status == 403) return Promise.reject(new AccessDeniedError());
          else if (res.status == 422)
            return Promise.reject(new ServerValidationError(res.data));
        }
        return Promise.reject(new UnexpectedError());
      });
  };
}
