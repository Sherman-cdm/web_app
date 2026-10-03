export interface MedicalStudy {
  id: string;
  hospitalId: string;
  dni: string;
  name: string;
  date: string;
  status: 'available' | 'pending';
  result?: string;
}
