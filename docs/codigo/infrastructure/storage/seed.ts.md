# seed.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/infrastructure/storage/seed.ts)

**Ruta:** `src/infrastructure/storage/seed.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
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
  return {
    version: 2,
    hospitals: structuredClone(data.hospitals),
    specialties: data.specialties.map((s) => ({ ...structuredClone(s), active: true })),
    professionals: data.specialties.map((s, i) => ({
      id: `prof-${s.id}`,
      hospitalId: s.hospitalId,
      fullName: names[i],
      license: `DEMO-${1000 + i}`,
      specialtyIds: [s.id],
      email: `profesional${i + 1}@ejemplo.com`,
      phone: '11 5555 1234',
      active: true,
    })),
    agendas: data.specialties.map((s, i) => ({
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
```
