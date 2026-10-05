import type { Patient } from './appointment';

export type UserRole = 'patient' | 'medical';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  identifier: string;
  patient?: Patient;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: number;
}

export interface LoginCredentials {
  role: UserRole;
  identifier: string;
  password: string;
}

export interface PatientRegistration {
  fullName: string;
  dni: string;
  email: string;
  password: string;
}
