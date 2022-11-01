import { httpAuthClient, httpClient } from "@/data/http";

import { AuthService } from "./auth-service";
import { ClinicService } from "./clinic-service";

export const authService = new AuthService(httpAuthClient);
export const clinicService = new ClinicService(httpClient);
