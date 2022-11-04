export type ActingModel = {
  id: number;
  clinic_id: number;
  professional_id: number;
  specialty_id: number;
};

export type ActingProfessionalModel = {
  id: number;
  clinic_id: number;
  specialty_id: number;
  clinic_name: string;
  specialty_description: string;
};
