import data from '../../mocks/mockData.json';
import type { HospitalState } from '../../types';

export function initialState(): HospitalState {
  const names = [
    'Lucía Fernández',
    'Martín Suárez',
    'Valentina Torres',
    'Pablo Rodríguez',
    'Carolina Gómez',
    'Diego Acosta',
    'Sofía Medina',
    'Andrés López',
    'Camila Romero',
  ];
  const scheduledSpecialties = data.specialties.filter((s) => s.schedule.days.length > 0);
  return {
    version: 2,
    hospitals: structuredClone(data.hospitals),
    specialties: data.specialties.map((s) => ({ ...structuredClone(s), active: true })),
    professionals: scheduledSpecialties.map((s, i) => ({
      id: `prof-${s.id}`,
      hospitalId: s.hospitalId,
      fullName: names[i],
      license: `DEMO-${1000 + i}`,
      specialtyIds: [s.id],
      email: `profesional${i + 1}@ejemplo.com`,
      phone: '11 5555 1234',
      active: true,
    })),
    agendas: scheduledSpecialties.map((s, i) => ({
      ...structuredClone(s.schedule),
      id: `agenda-${s.id}`,
      hospitalId: s.hospitalId,
      specialtyId: s.id,
      professionalId: `prof-${s.id}`,
      room: `Consultorio ${(i % 3) + 1}`,
      validFrom: '2020-01-01',
      validTo: '2099-12-31',
      active: true,
    })),
    appointments: [],
    blocks: [],
    studies: structuredClone(data.studies) as HospitalState['studies'],
    settings: data.hospitals.map((h) => ({ hospitalId: h.id, autoApprove: false })),
    audit: [],
  };
}
