// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authService, canAccess, SESSION_DURATION, SESSION_KEY } from '../authService';

async function settle<T>(promise: Promise<T>): Promise<T> {
  const outcome = promise.then(
    (value) => ({ value }),
    (error) => ({ error }),
  );
  await vi.runAllTimersAsync();
  const result = await outcome;
  if ('error' in result) throw result.error;
  return result.value;
}

describe('Accesos de demostración por perfil', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-02T15:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('inicia sesión de paciente y la recupera sin almacenar la contraseña', async () => {
    const session = await settle(
      authService.login({ role: 'patient', identifier: '30123456', password: 'Paciente123!' }),
    );
    expect(session.user.patient?.dni).toBe('30123456');
    expect(authService.readSession()).toEqual(session);
    expect(sessionStorage.getItem(SESSION_KEY)).not.toContain('Paciente123!');
    expect(canAccess(session, 'patient')).toBe(true);
    expect(canAccess(session, 'medical')).toBe(false);
  });
  it('permite el acceso médico con correo normalizado', async () => {
    const session = await settle(
      authService.login({
        role: 'medical',
        identifier: ' MEDICO@PILAR.DEMO ',
        password: 'Medico123!',
      }),
    );
    expect(canAccess(session, 'medical')).toBe(true);
    expect(canAccess(session, 'patient')).toBe(false);
  });
  it('rechaza contraseñas incorrectas y cuentas de otro perfil', async () => {
    await expect(
      settle(
        authService.login({ role: 'patient', identifier: '30123456', password: 'incorrecta' }),
      ),
    ).rejects.toThrow('no son correctos');
    await expect(
      settle(
        authService.login({ role: 'medical', identifier: '30123456', password: 'Paciente123!' }),
      ),
    ).rejects.toThrow('no son correctos');
    expect(authService.readSession()).toBeNull();
  });
  it('mantiene la sesión anterior si falla el cambio de perfil', async () => {
    const session = await settle(
      authService.login({ role: 'patient', identifier: '30123456', password: 'Paciente123!' }),
    );
    await expect(
      settle(
        authService.login({
          role: 'medical',
          identifier: 'medico@pilar.demo',
          password: 'incorrecta',
        }),
      ),
    ).rejects.toThrow();
    expect(authService.readSession()).toEqual(session);
  });
  it('cierra la sesión y bloquea el acceso sin sesión', async () => {
    await settle(
      authService.login({ role: 'patient', identifier: '30123456', password: 'Paciente123!' }),
    );
    authService.logout();
    expect(authService.readSession()).toBeNull();
    expect(canAccess(null, 'patient')).toBe(false);
  });
  it('vence la sesión después de ocho horas', async () => {
    const session = await settle(
      authService.login({
        role: 'medical',
        identifier: 'medico@pilar.demo',
        password: 'Medico123!',
      }),
    );
    vi.setSystemTime(Date.now() + SESSION_DURATION);
    expect(authService.readSession()).toBeNull();
    expect(canAccess(session, 'medical')).toBe(false);
  });
  it('descarta sesiones dañadas o usuarios inexistentes', () => {
    sessionStorage.setItem(SESSION_KEY, '{invalid');
    expect(authService.readSession()).toBeNull();
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId: 'desconocido', expiresAt: Date.now() + 1000 }),
    );
    expect(authService.readSession()).toBeNull();
  });
  it('no confirma el acceso si falla la persistencia', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Almacenamiento bloqueado');
    });
    await expect(
      settle(
        authService.login({ role: 'patient', identifier: '30123456', password: 'Paciente123!' }),
      ),
    ).rejects.toThrow('No se pudo iniciar');
    expect(authService.readSession()).toBeNull();
  });
});
