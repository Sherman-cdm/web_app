import {
  patientAccountUser,
  readPatientAccounts,
  savePatientAccounts,
} from '../infrastructure/storage/patientAccounts';
import { demoAccounts } from '../mocks/demoAccounts';
import type { AuthUser, PatientRegistration } from '../types/auth';

export async function derivePassword(password: string, salt: string): Promise<string> {
  if (!crypto.subtle)
    throw new Error(
      'Para crear una cuenta necesitás abrir la aplicación en localhost o mediante HTTPS.',
    );
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 210_000 },
    material,
    256,
  );
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function registerPatient(input: PatientRegistration): Promise<AuthUser> {
  const fullName = input.fullName.trim().replace(/\s+/g, ' ');
  const dni = input.dni.trim();
  const email = input.email.trim().toLowerCase();
  if (fullName.length < 2 || fullName.length > 100)
    throw new Error('Ingresá un nombre de entre 2 y 100 caracteres.');
  if (!/^\d{7,8}$/.test(dni)) throw new Error('El DNI debe tener 7 u 8 números, sin puntos.');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error('Ingresá un correo electrónico válido.');
  if (input.password.length < 8 || input.password.length > 128 || !input.password.trim())
    throw new Error('La contraseña debe tener entre 8 y 128 caracteres.');
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const passwordHash = await derivePassword(input.password, salt);

  // Se relee justo antes de escribir para conservar otras altas y detectar duplicados.
  const persist = () => {
    const accounts = readPatientAccounts();
    if (
      accounts.some((account) => account.dni === dni) ||
      demoAccounts.some((account) => account.user.patient?.dni === dni)
    )
      throw new Error('Ya existe una cuenta con ese DNI. Ingresá con tu contraseña.');
    if (
      accounts.some((account) => account.email === email) ||
      demoAccounts.some(
        (account) =>
          account.user.patient?.email.toLowerCase() === email ||
          account.user.identifier.toLowerCase() === email,
      )
    )
      throw new Error('Ya existe una cuenta con ese correo electrónico.');
    const account = {
      id: `patient-${crypto.randomUUID()}`,
      fullName,
      dni,
      email,
      salt,
      passwordHash,
    };
    savePatientAccounts([...accounts, account]);
    return patientAccountUser(account);
  };
  return typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request('mi-salud.patient-registration', persist)
    : persist();
}
