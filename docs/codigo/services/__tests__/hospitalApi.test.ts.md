# hospitalApi.test.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/services/__tests__/hospitalApi.test.ts)

**Ruta:** `src/services/__tests__/hospitalApi.test.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LEGACY_KEY, STORAGE_KEY } from '../../infrastructure/storage/keys';
import type { BookingRequest } from '../../types';
import { api } from '../api';
import { hospitalApi } from '../hospitalApi';

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

describe('Portal hospitalario integrado', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-02T10:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('recibe solicitudes pendientes, retiene el cupo y permite aprobarlas', async () => {
    const a = await settle(api.createAppointment(request));
    expect(a.status).toBe('pending');
    expect(
      (await settle(api.getTimeSlots('central', 'clinica-central', request.date))).find(
        (s) => s.time === '08:00',
      )?.available,
    ).toBe(false);
    await settle(hospitalApi.setStatus('central', a.id, 'confirmed'));
    expect((await settle(api.getAppointments()))[0].status).toBe('confirmed');
    expect((await settle(hospitalApi.getState())).audit).toHaveLength(2);
  });
  it('crea turnos confirmados desde recepción y asigna profesional', async () => {
    const a = await settle(hospitalApi.createAppointment(request));
    expect(a.status).toBe('confirmed');
    expect(a.professionalId).toBe('prof-clinica-central');
    expect(a.source).toBe('hospital');
  });
  it('exige motivo para rechazar y libera el cupo', async () => {
    const a = await settle(api.createAppointment(request));
    await expect(settle(hospitalApi.setStatus('central', a.id, 'rejected'))).rejects.toMatchObject({
      code: 'VALIDATION',
    });
    await settle(hospitalApi.setStatus('central', a.id, 'rejected', 'Derivar a otro servicio'));
    expect((await settle(api.getAppointments()))[0].reason).toBe('Derivar a otro servicio');
    expect(
      (await settle(api.getTimeSlots('central', 'clinica-central', request.date))).find(
        (s) => s.time === '08:00',
      )?.available,
    ).toBe(true);
  });
  it('impide operar turnos de otro hospital y transiciones inválidas', async () => {
    const a = await settle(api.createAppointment(request));
    await expect(settle(hospitalApi.setStatus('derqui', a.id, 'confirmed'))).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    await expect(settle(hospitalApi.setStatus('central', a.id, 'completed'))).rejects.toMatchObject(
      { code: 'CONFLICT' },
    );
    await settle(hospitalApi.setStatus('central', a.id, 'confirmed'));
    await expect(settle(hospitalApi.setStatus('central', a.id, 'arrived'))).rejects.toMatchObject({
      code: 'VALIDATION',
    });
  });
  it('reprograma y libera el horario anterior sin perder el identificador', async () => {
    const a = await settle(api.createAppointment(request));
    const updated = await settle(
      hospitalApi.rescheduleAppointment(a.id, { ...request, time: '09:00' }),
    );
    expect(updated.id).toBe(a.id);
    expect(updated.status).toBe('confirmed');
    const slots = await settle(api.getTimeSlots('central', 'clinica-central', request.date));
    expect(slots.find((s) => s.time === '08:00')?.available).toBe(true);
    expect(slots.find((s) => s.time === '09:00')?.available).toBe(false);
  });
  it('una reprogramación inválida conserva el turno y el registro de actividad', async () => {
    const a = await settle(api.createAppointment(request));
    await settle(
      hospitalApi.createAppointment({
        ...request,
        time: '09:00',
        patient: { ...request.patient, dni: '28987654' },
      }),
    );
    const before = localStorage.getItem(STORAGE_KEY);
    await expect(
      settle(hospitalApi.rescheduleAppointment(a.id, { ...request, time: '09:00' })),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });
  it('incorpora un área y un profesional y publica nuevos cupos para pacientes', async () => {
    const area = await settle(
      hospitalApi.saveSpecialty({
        id: '',
        hospitalId: 'central',
        name: 'Neurología',
        description: 'Consultas de neurología',
        active: true,
        schedule: { days: [], start: '08:00', end: '12:00', slotMinutes: 30 },
      }),
    );
    const professional = await settle(
      hospitalApi.saveProfessional({
        id: '',
        hospitalId: 'central',
        fullName: 'Ana Prueba',
        license: 'TEST-44',
        email: 'ana@ejemplo.com',
        phone: '11 5555 4444',
        specialtyIds: [area.id],
        active: true,
      }),
    );
    await settle(
      hospitalApi.saveAgenda({
        id: '',
        hospitalId: 'central',
        specialtyId: area.id,
        professionalId: professional.id,
        room: 'Consultorio nuevo',
        days: [1],
        start: '10:00',
        end: '12:00',
        slotMinutes: 20,
        validFrom: '2026-10-05',
        validTo: '2026-12-31',
        active: true,
      }),
    );
    expect(
      (await settle(api.getSpecialties('central'))).find((s) => s.id === area.id)?.schedule.days,
    ).toEqual([1]);
    expect(await settle(api.getTimeSlots('central', area.id, request.date))).toHaveLength(6);
  });
  it('rechaza matrículas duplicadas y asignaciones a áreas de otro hospital', async () => {
    const state = await settle(hospitalApi.getState());
    const p = state.professionals[0];
    await expect(settle(hospitalApi.saveProfessional({ ...p, id: '' }))).rejects.toMatchObject({
      code: 'CONFLICT',
    });
    await expect(
      settle(hospitalApi.saveProfessional({ ...p, specialtyIds: ['clinica-derqui'] })),
    ).rejects.toMatchObject({ code: 'VALIDATION' });
  });
  it('protege profesionales, áreas y agendas que tienen turnos abiertos', async () => {
    await settle(api.createAppointment(request));
    const state = await settle(hospitalApi.getState());
    await expect(
      settle(hospitalApi.saveProfessional({ ...state.professionals[0], active: false })),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    await expect(
      settle(hospitalApi.saveSpecialty({ ...state.specialties[0], active: false })),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    await expect(
      settle(hospitalApi.saveAgenda({ ...state.agendas[0], active: false })),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    expect((await settle(hospitalApi.getState())).agendas[0].active).toBe(true);
  });
  it('rechaza superposiciones de profesional y consultorio', async () => {
    const state = await settle(hospitalApi.getState());
    const a = state.agendas[0];
    await expect(
      settle(hospitalApi.saveAgenda({ ...a, id: '', room: 'Otro' })),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    await expect(
      settle(hospitalApi.saveAgenda({ ...state.agendas[1], id: '', room: a.room })),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
  it('dos profesionales pueden ofrecer el mismo horario a pacientes diferentes', async () => {
    const state = await settle(hospitalApi.getState());
    const p = await settle(
      hospitalApi.saveProfessional({
        ...state.professionals[0],
        id: '',
        license: 'OTRA-45',
        fullName: 'Otro Profesional',
      }),
    );
    await settle(
      hospitalApi.saveAgenda({
        ...state.agendas[0],
        id: '',
        professionalId: p.id,
        room: 'Consultorio extra',
      }),
    );
    const a = await settle(api.createAppointment(request));
    const b = await settle(
      api.createAppointment({ ...request, patient: { ...request.patient, dni: '28987654' } }),
    );
    expect(a.professionalId).not.toBe(b.professionalId);
    expect(
      (await settle(api.getTimeSlots('central', 'clinica-central', request.date))).find(
        (s) => s.time === '08:00',
      )?.available,
    ).toBe(false);
  });
  it('bloquea fechas, respeta el hospital y recupera cupos al retirar el bloqueo', async () => {
    const b = await settle(
      hospitalApi.addBlock({
        hospitalId: 'central',
        professionalId: '',
        from: request.date,
        to: request.date,
        reason: 'Mantenimiento',
      }),
    );
    expect(await settle(api.getTimeSlots('central', 'clinica-central', request.date))).toEqual([]);
    expect(
      (await settle(api.getTimeSlots('derqui', 'clinica-derqui', request.date))).length,
    ).toBeGreaterThan(0);
    await settle(hospitalApi.removeBlock('central', b.id));
    expect(
      (await settle(api.getTimeSlots('central', 'clinica-central', request.date))).length,
    ).toBeGreaterThan(0);
  });
  it('un bloqueo con turnos abiertos no se aplica parcialmente', async () => {
    await settle(api.createAppointment(request));
    await expect(
      settle(
        hospitalApi.addBlock({
          hospitalId: 'central',
          professionalId: '',
          from: request.date,
          to: request.date,
          reason: 'Vacaciones',
        }),
      ),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    expect((await settle(hospitalApi.getState())).blocks).toEqual([]);
  });
  it('publica informes visibles desde el portal del paciente', async () => {
    await expect(
      settle(
        hospitalApi.saveStudy({
          id: '',
          hospitalId: 'central',
          dni: '30123456',
          name: 'Estudio prueba',
          date: '2026-10-01',
          status: 'available',
          result: '',
        }),
      ),
    ).rejects.toMatchObject({ code: 'VALIDATION' });
    const study = await settle(
      hospitalApi.saveStudy({
        id: '',
        hospitalId: 'central',
        dni: '30123456',
        name: 'Estudio prueba',
        date: '2026-10-01',
        status: 'available',
        result: 'Informe ficticio sin validez clínica.',
      }),
    );
    expect((await settle(api.getStudies('30123456'))).find((s) => s.id === study.id)?.status).toBe(
      'available',
    );
  });
  it('la aprobación automática solo se aplica a nuevas solicitudes del hospital configurado', async () => {
    await settle(api.createAppointment(request));
    await settle(hospitalApi.saveSettings('central', true));
    expect((await settle(api.createAppointment({ ...request, time: '09:00' }))).status).toBe(
      'confirmed',
    );
    expect((await settle(api.getAppointments()))[0].status).toBe('pending');
    expect(
      (
        await settle(
          api.createAppointment({
            ...request,
            hospitalId: 'derqui',
            specialtyId: 'clinica-derqui',
            time: '10:00',
          }),
        )
      ).status,
    ).toBe('pending');
  });
  it('migra turnos anteriores sin borrar la copia original', async () => {
    const legacy = {
      ...request,
      id: 'PIL-ANTERIOR',
      status: 'confirmed',
      createdAt: '2026-10-01T10:00:00Z',
    };
    const raw = JSON.stringify([legacy]);
    localStorage.setItem(LEGACY_KEY, raw);
    expect((await settle(api.getAppointments()))[0].professionalId).toBe('prof-clinica-central');
    await settle(hospitalApi.saveSettings('central', true));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).appointments[0].id).toBe('PIL-ANTERIOR');
    expect(localStorage.getItem(LEGACY_KEY)).toBe(raw);
  });
});
```
