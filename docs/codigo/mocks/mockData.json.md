# mockData.json

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/mocks/mockData.json)

**Ruta:** `src/mocks/mockData.json`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```json
{
  "hospitals": [
    {
      "id": "central",
      "name": "Hospital Central de Pilar",
      "shortName": "Hospital Central",
      "address": "Sede Central · Pilar",
      "area": "Pilar centro"
    },
    {
      "id": "sanguinetti",
      "name": "Hospital Municipal Cirilo Sanguinetti",
      "shortName": "Cirilo Sanguinetti",
      "address": "Sede municipal · Pilar",
      "area": "Pilar centro"
    },
    {
      "id": "derqui",
      "name": "Hospital de Presidente Derqui",
      "shortName": "Presidente Derqui",
      "address": "Sede Derqui · Presidente Derqui",
      "area": "Presidente Derqui"
    }
  ],
  "specialties": [
    {
      "id": "clinica-central",
      "hospitalId": "central",
      "name": "Clínica médica",
      "description": "Atención integral y controles de salud para adultos.",
      "schedule": { "days": [1, 2, 3, 4, 5], "start": "08:00", "end": "13:00", "slotMinutes": 30 }
    },
    {
      "id": "cardio-central",
      "hospitalId": "central",
      "name": "Cardiología",
      "description": "Consultas y seguimiento de la salud cardiovascular.",
      "schedule": { "days": [1, 3, 5], "start": "09:00", "end": "12:00", "slotMinutes": 30 }
    },
    {
      "id": "trauma-central",
      "hospitalId": "central",
      "name": "Traumatología",
      "description": "Atención de huesos, articulaciones y lesiones.",
      "schedule": { "days": [2, 4], "start": "14:00", "end": "17:00", "slotMinutes": 30 }
    },
    {
      "id": "pediatria-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Pediatría",
      "description": "Controles y atención de niñas, niños y adolescentes.",
      "schedule": { "days": [1, 2, 3, 4, 5], "start": "08:00", "end": "12:00", "slotMinutes": 20 }
    },
    {
      "id": "gineco-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Ginecología",
      "description": "Controles, prevención y acompañamiento de la salud.",
      "schedule": { "days": [2, 4], "start": "09:00", "end": "13:00", "slotMinutes": 30 }
    },
    {
      "id": "derma-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Dermatología",
      "description": "Diagnóstico y seguimiento del cuidado de la piel.",
      "schedule": { "days": [1, 3], "start": "13:00", "end": "16:00", "slotMinutes": 30 }
    },
    {
      "id": "clinica-derqui",
      "hospitalId": "derqui",
      "name": "Clínica médica",
      "description": "Consultas generales y controles de salud para adultos.",
      "schedule": { "days": [1, 2, 3, 4, 5], "start": "08:00", "end": "14:00", "slotMinutes": 30 }
    },
    {
      "id": "pediatria-derqui",
      "hospitalId": "derqui",
      "name": "Pediatría",
      "description": "Atención y seguimiento del crecimiento infantil.",
      "schedule": { "days": [1, 3, 5], "start": "08:00", "end": "12:00", "slotMinutes": 20 }
    },
    {
      "id": "oftalmo-derqui",
      "hospitalId": "derqui",
      "name": "Oftalmología",
      "description": "Controles de visión y consultas de salud ocular.",
      "schedule": { "days": [2, 4], "start": "10:00", "end": "14:00", "slotMinutes": 30 }
    }
  ],
  "studies": [
    {
      "id": "EST-001",
      "hospitalId": "central",
      "dni": "30123456",
      "name": "Análisis de laboratorio",
      "date": "2026-09-25",
      "status": "available",
      "result": "Informe ficticio de laboratorio. Este documento es una demostración y no tiene validez clínica."
    },
    {
      "id": "EST-002",
      "hospitalId": "central",
      "dni": "30123456",
      "name": "Radiografía de tórax",
      "date": "2026-09-29",
      "status": "pending"
    },
    {
      "id": "EST-003",
      "hospitalId": "derqui",
      "dni": "28987654",
      "name": "Ecografía abdominal",
      "date": "2026-09-22",
      "status": "available",
      "result": "Informe ficticio de ecografía. Este documento es una demostración y no tiene validez clínica."
    }
  ]
}
```
