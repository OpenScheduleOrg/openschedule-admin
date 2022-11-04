import { ActingProfessionalModel } from "./acting-model";

export type ProfessionalModel = {
  id: number;
  name: string;
  phone: string;
  reg_number: string;
  username: string;
  email: string;
  actuations: ActingProfessionalModel[];
};
