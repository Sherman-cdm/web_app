export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  address: string;
  area: string;
}

export interface Schedule {
  days: number[];
  start: string;
  end: string;
  slotMinutes: number;
}

export interface Specialty {
  id: string;
  hospitalId: string;
  name: string;
  description: string;
  schedule: Schedule;
  active?: boolean;
}

export interface HospitalSettings {
  hospitalId: string;
  autoApprove: boolean;
}
