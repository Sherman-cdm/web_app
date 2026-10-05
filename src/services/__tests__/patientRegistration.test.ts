// @vitest-environment jsdom
import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PATIENT_ACCOUNTS_KEY,
  readPatientAccounts,
} from '../../infrastructure/storage/patientAccounts';
import { authService, canAccess } from '../authService';

const input = {
  fullName: ' Ana Prueba ',
  dni: '40123456',
  email: ' ANA@EJEMPLO.COM ',
  password: 'MiClave123!',
};

describe('Registro local de pacientes', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('crypto', webcrypto);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('crea una cuenta, permite ingresar y recupera su sesión sin guardar la contraseña', async () => {
    const user = await authService.registerPatient(input);
    expect(user).toMatchObject({
      role: 'patient',
      name: 'Ana Prueba',
      identifier: input.dni,
      patient: { email: 'ana@ejemplo.com', phone: '' },
    });
    expect(authService.readSession()).toBeNull();
    const stored = localStorage.getItem(PATIENT_ACCOUNTS_KEY)!;
    expect(stored).not.toContain(input.password);
    expect(readPatientAccounts()[0].passwordHash).toHaveLength(64);
    const session = await authService.login({
      role: 'patient',
      identifier: input.dni,
      password: input.password,
    });
    expect(session.user).toEqual(user);
    expect(authService.readSession()).toEqual(session);
    expect(canAccess(session, 'medical')).toBe(false);
    authService.logout();
    expect(authService.readSession()).toBeNull();
    expect(
      (
        await authService.login({
          role: 'patient',
          identifier: input.dni,
          password: input.password,
        })
      ).user,
    ).toEqual(user);
  });

  it('rechaza credenciales incorrectas y no concede acceso médico', async () => {
    await authService.registerPatient(input);
    await expect(
      authService.login({ role: 'patient', identifier: input.dni, password: 'incorrecta' }),
    ).rejects.toThrow('no son correctos');
    await expect(
      authService.login({ role: 'medical', identifier: input.dni, password: input.password }),
    ).rejects.toThrow('no son correctos');
  });

  it('rechaza DNI y correo repetidos, incluso los de las cuentas de ejemplo', async () => {
    await authService.registerPatient(input);
    await expect(
      authService.registerPatient({ ...input, email: 'otra@ejemplo.com' }),
    ).rejects.toThrow('ese DNI');
    await expect(authService.registerPatient({ ...input, dni: '41123456' })).rejects.toThrow(
      'ese correo',
    );
    await expect(
      authService.registerPatient({ ...input, dni: '30123456', email: 'otra@ejemplo.com' }),
    ).rejects.toThrow('ese DNI');
    await expect(
      authService.registerPatient({ ...input, dni: '41123456', email: 'MARIA@EJEMPLO.COM' }),
    ).rejects.toThrow('ese correo');
    expect(readPatientAccounts()).toHaveLength(1);
  });

  it.each([
    { fullName: ' ' },
    { dni: 'abc' },
    { dni: '123' },
    { email: 'invalido' },
    { password: 'corta' },
    { password: '        ' },
    { password: 'x'.repeat(129) },
  ])('rechaza datos inválidos: %j', async (changes) => {
    await expect(authService.registerPatient({ ...input, ...changes })).rejects.toThrow();
    expect(readPatientAccounts()).toHaveLength(0);
  });

  it('conserva altas simultáneas y evita duplicar un DNI en la misma instancia', async () => {
    const outcomes = await Promise.allSettled([
      authService.registerPatient(input),
      authService.registerPatient(input),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === 'fulfilled')).toHaveLength(1);
    await authService.registerPatient({ ...input, dni: '41123456', email: 'otra@ejemplo.com' });
    const accounts = readPatientAccounts();
    expect(accounts).toHaveLength(2);
    expect(accounts[0].salt).not.toBe(accounts[1].salt);
    expect(accounts[0].passwordHash).not.toBe(accounts[1].passwordHash);
  });

  it('no confirma el registro cuando falla el guardado', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Bloqueado');
    });
    await expect(authService.registerPatient(input)).rejects.toThrow('No se pudo guardar');
    expect(authService.readSession()).toBeNull();
  });

  it('no sobrescribe un catálogo de cuentas dañado', async () => {
    localStorage.setItem(PATIENT_ACCOUNTS_KEY, '{invalid');
    await expect(authService.registerPatient(input)).rejects.toThrow('No se pudieron leer');
    expect(localStorage.getItem(PATIENT_ACCOUNTS_KEY)).toBe('{invalid');
  });
});
