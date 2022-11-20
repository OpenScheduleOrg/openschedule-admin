import { httpAuthClient, httpClient } from "@/data/http";

import { AuthService } from "./auth-service";
import { ClinicService } from "./clinic-service";
import { SpecialtyService } from "./specialty-service";
import { ProfessionalService } from "./professional-service";
import { ActingService } from "./acting-service";
import { ScheduleService } from "./schedule-service";
import { AppointmentService } from "./appointment-service";

export const authService = new AuthService(httpAuthClient);
export const clinicService = new ClinicService(httpClient);
export const specialtyService = new SpecialtyService(httpClient);
export const professionalService = new ProfessionalService(httpClient);
export const actingService = new ActingService(httpClient);
export const scheduleService = new ScheduleService(httpClient);
export const appointmentService = new AppointmentService(httpClient);
