import type { Appointment, BookingRequest, TimeSlot } from './appointment';
import type { Hospital, Specialty } from './hospital';
import type { MedicalStudy } from './study';

export interface HealthApi {
  getHospitals(): Promise<Hospital[]>;
  getSpecialties(hospitalId?: string): Promise<Specialty[]>;
  getTimeSlots(hospitalId: string, specialtyId: string, date: string): Promise<TimeSlot[]>;
  getAppointments(): Promise<Appointment[]>;
  createAppointment(request: BookingRequest): Promise<Appointment>;
  cancelAppointment(id: string): Promise<Appointment>;
  getStudies(dni: string): Promise<MedicalStudy[]>;
}
