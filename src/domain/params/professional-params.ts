export type ProfessionalBody = {
  name: string;
  phone: string;
  username: string;
  email: string;
  password?: string;
  reg_number?: string;
};

export type ProfessionalFilter = {
  name?: string;
  limit?: number;
};
