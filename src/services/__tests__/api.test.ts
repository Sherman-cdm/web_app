// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BookingRequest } from '../../types';
import { api, STORAGE_KEY } from '../api';

const request: BookingRequest = {
  hospitalId: 'central',
  specialtyId: 'clinica-central',
  date: '2026-10-05',
  time: '08:00',
  patient: {
    dni: '30123456',
    fullName: 'María Prueba',
    email: 'maria@ejemplo.com',
    phone: '11 5555 1234',
  },
};

async function resolve<T>(promise: Promise<T>): Promise<T> {
  const settled = promise.then(
    (value) => ({ value }),
    (error) => ({ error }),
  );
  await vi.runAllTimersAsync();
  const result = await settled;
  if ('error' in result) throw result.error;
  return result.value;
}

describe('Servicio de turnos y estudios', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-02T10:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('persiste una reserva y la recupera desde el almacenamiento', async () => {
    const appointment = await resolve(api.createAppointment(request));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).appointments[0].id).toBe(appointment.id);
    expect(await resolve(api.getAppointments())).toEqual([appointment]);
    const slots = await resolve(api.getTimeSlots('central', 'clinica-central', request.date));
    expect(slots.find((s) => s.time === '08:00')?.available).toBe(false);
  });
  it('impide dos reservas concurrentes del mismo horario', async () => {
    const results = Promise.allSettled([
      api.createAppointment(request),
      api.createAppointment(request),
    ]);
    await vi.runAllTimersAsync();
    const outcomes = await results;
    expect(outcomes.map((r) => r.status)).toEqual(['fulfilled', 'rejected']);
    expect(await resolve(api.getAppointments())).toHaveLength(1);
  });
  it('cancelar mantiene el historial y libera el horario', async () => {
    const appointment = await resolve(api.createAppointment(request));
    expect((await resolve(api.cancelAppointment(appointment.id))).status).toBe('cancelled');
    expect(
      (await resolve(api.getTimeSlots('central', 'clinica-central', request.date))).find(
        (s) => s.time === '08:00',
      )?.available,
    ).toBe(true);
    await resolve(api.createAppointment(request));
    expect(await resolve(api.getAppointments())).toHaveLength(2);
  });
  it('rechaza DNI inválido, fechas pasadas, días sin atención y hospitales incompatibles', async () => {
    await expect(
      resolve(api.createAppointment({ ...request, patient: { ...request.patient, dni: '123' } })),
    ).rejects.toMatchObject({ code: 'VALIDATION' });
    for (const invalid of [
      { date: '2026-10-01' },
      { date: '2026-10-04' },
      { hospitalId: 'derqui' },
    ]) {
      await expect(
        resolve(api.createAppointment({ ...request, ...invalid })),
      ).rejects.toMatchObject({ code: 'CONFLICT' });
    }
  });
  it('rechaza solapamientos del mismo DNI en otra especialidad', async () => {
    await resolve(api.createAppointment(request));
    await expect(
      resolve(
        api.createAppointment({ ...request, hospitalId: 'derqui', specialtyId: 'clinica-derqui' }),
      ),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
  it('excluye horarios ya pasados del día actual en Argentina', async () => {
    vi.setSystemTime(new Date('2026-10-02T13:15:00Z'));
    const slots = await resolve(api.getTimeSlots('central', 'clinica-central', '2026-10-02'));
    expect(slots.find((s) => s.time === '10:00')?.available).toBe(false);
    expect(slots.find((s) => s.time === '10:30')?.available).toBe(true);
  });
  it('consulta estudios por DNI y distingue disponible de pendiente', async () => {
    expect((await resolve(api.getStudies('30123456'))).map((s) => s.status)).toEqual([
      'available',
      'pending',
    ]);
    expect(await resolve(api.getStudies('11111111'))).toEqual([]);
    await expect(resolve(api.getStudies('abc'))).rejects.toMatchObject({ code: 'VALIDATION' });
  });
  it('informa datos dañados sin borrarlos', async () => {
    localStorage.setItem(STORAGE_KEY, '{invalid');
    await expect(resolve(api.getAppointments())).rejects.toMatchObject({ code: 'STORAGE' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{invalid');
  });
  it('informa error al guardar sin confirmar una reserva inexistente', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Cuota excedida');
    });
    await expect(resolve(api.createAppointment(request))).rejects.toMatchObject({
      code: 'STORAGE',
    });
    expect(await resolve(api.getAppointments())).toHaveLength(0);
  });
});
