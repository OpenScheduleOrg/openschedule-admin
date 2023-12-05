export type UserBody = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  picture?: string;
  active?: boolean;
  clinic_id?: number;
};

export type UserFilter = {
  name?: string;
  limit?: number;
};
