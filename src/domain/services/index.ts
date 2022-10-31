import { httpAuthClient } from "@/data/http";

import { AuthService } from "./auth-service";

export const authService = new AuthService(httpAuthClient);
