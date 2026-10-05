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
      "schedule": {
        "days": [1, 2, 3, 4, 5],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cardio-central",
      "hospitalId": "central",
      "name": "Cardiología",
      "description": "Consultas y seguimiento de la salud cardiovascular.",
      "schedule": {
        "days": [1, 3, 5],
        "start": "09:00",
        "end": "12:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "trauma-central",
      "hospitalId": "central",
      "name": "Traumatología",
      "description": "Atención de huesos, articulaciones y lesiones.",
      "schedule": {
        "days": [2, 4],
        "start": "14:00",
        "end": "17:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "pediatria-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Pediatría",
      "description": "Controles y atención de niñas, niños y adolescentes.",
      "schedule": {
        "days": [1, 2, 3, 4, 5],
        "start": "08:00",
        "end": "12:00",
        "slotMinutes": 20
      }
    },
    {
      "id": "gineco-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Ginecología",
      "description": "Controles, prevención y acompañamiento de la salud.",
      "schedule": {
        "days": [2, 4],
        "start": "09:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "derma-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Dermatología",
      "description": "Diagnóstico y seguimiento del cuidado de la piel.",
      "schedule": {
        "days": [1, 3],
        "start": "13:00",
        "end": "16:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "clinica-derqui",
      "hospitalId": "derqui",
      "name": "Clínica médica",
      "description": "Consultas generales y controles de salud para adultos.",
      "schedule": {
        "days": [1, 2, 3, 4, 5],
        "start": "08:00",
        "end": "14:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "pediatria-derqui",
      "hospitalId": "derqui",
      "name": "Pediatría",
      "description": "Atención y seguimiento del crecimiento infantil.",
      "schedule": {
        "days": [1, 3, 5],
        "start": "08:00",
        "end": "12:00",
        "slotMinutes": 20
      }
    },
    {
      "id": "oftalmo-derqui",
      "hospitalId": "derqui",
      "name": "Oftalmología",
      "description": "Controles de visión y consultas de salud ocular.",
      "schedule": {
        "days": [2, 4],
        "start": "10:00",
        "end": "14:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-general-central",
      "hospitalId": "central",
      "name": "Cirugía General",
      "description": "Atención en cirugía general.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-protocolar-central",
      "hospitalId": "central",
      "name": "Cirugía Protocolar",
      "description": "Atención en cirugía protocolar.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-toracica-central",
      "hospitalId": "central",
      "name": "Cirugía Torácica",
      "description": "Atención en cirugía torácica.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-vascular-central",
      "hospitalId": "central",
      "name": "Cirugía Vascular",
      "description": "Atención en cirugía vascular.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psicologia-central",
      "hospitalId": "central",
      "name": "Psicología",
      "description": "Atención en psicología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psiquiatria-central",
      "hospitalId": "central",
      "name": "Psiquiatría",
      "description": "Atención en psiquiatría.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cuidados-paliativos-central",
      "hospitalId": "central",
      "name": "Cuidados Paliativos",
      "description": "Atención en cuidados paliativos.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "dermatologia-central",
      "hospitalId": "central",
      "name": "Dermatología",
      "description": "Atención en dermatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "gastroenterologia-central",
      "hospitalId": "central",
      "name": "Gastroenterología",
      "description": "Atención en gastroenterología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "ginecologia-central",
      "hospitalId": "central",
      "name": "Ginecología",
      "description": "Atención en ginecología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "hematologia-central",
      "hospitalId": "central",
      "name": "Hematología",
      "description": "Atención en hematología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "infectologia-central",
      "hospitalId": "central",
      "name": "Infectología",
      "description": "Atención en infectología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "medicina-familiar-central",
      "hospitalId": "central",
      "name": "Medicina Familiar",
      "description": "Atención en medicina familiar.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "nefrologia-central",
      "hospitalId": "central",
      "name": "Nefrología",
      "description": "Atención en nefrología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neumonologia-central",
      "hospitalId": "central",
      "name": "Neumonología",
      "description": "Atención en neumonología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neurocirugia-central",
      "hospitalId": "central",
      "name": "Neurocirugía",
      "description": "Atención en neurocirugía.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neurologia-central",
      "hospitalId": "central",
      "name": "Neurología",
      "description": "Atención en neurología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "nutricion-central",
      "hospitalId": "central",
      "name": "Nutrición",
      "description": "Atención en nutrición.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "oncologia-central",
      "hospitalId": "central",
      "name": "Oncología",
      "description": "Atención en oncología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "patologia-mamaria-central",
      "hospitalId": "central",
      "name": "Patología Mamaria",
      "description": "Atención en patología mamaria.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "pie-diabetico-central",
      "hospitalId": "central",
      "name": "Pie diabético",
      "description": "Atención en pie diabético.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "reumatologia-central",
      "hospitalId": "central",
      "name": "Reumatología",
      "description": "Atención en reumatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "urologia-central",
      "hospitalId": "central",
      "name": "Urología",
      "description": "Atención en urología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cardiologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Cardiología",
      "description": "Atención en cardiología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-general-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Cirugía General",
      "description": "Atención en cirugía general.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-protocolar-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Cirugía Protocolar",
      "description": "Atención en cirugía protocolar.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-toracica-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Cirugía Torácica",
      "description": "Atención en cirugía torácica.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-vascular-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Cirugía Vascular",
      "description": "Atención en cirugía vascular.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "clinica-medica-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Clínica médica",
      "description": "Atención en clínica médica.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psicologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Psicología",
      "description": "Atención en psicología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psiquiatria-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Psiquiatría",
      "description": "Atención en psiquiatría.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cuidados-paliativos-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Cuidados Paliativos",
      "description": "Atención en cuidados paliativos.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "gastroenterologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Gastroenterología",
      "description": "Atención en gastroenterología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "hematologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Hematología",
      "description": "Atención en hematología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "infectologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Infectología",
      "description": "Atención en infectología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "medicina-familiar-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Medicina Familiar",
      "description": "Atención en medicina familiar.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "nefrologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Nefrología",
      "description": "Atención en nefrología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neumonologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Neumonología",
      "description": "Atención en neumonología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neurocirugia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Neurocirugía",
      "description": "Atención en neurocirugía.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neurologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Neurología",
      "description": "Atención en neurología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "nutricion-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Nutrición",
      "description": "Atención en nutrición.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "oncologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Oncología",
      "description": "Atención en oncología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "patologia-mamaria-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Patología Mamaria",
      "description": "Atención en patología mamaria.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "pie-diabetico-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Pie diabético",
      "description": "Atención en pie diabético.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "reumatologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Reumatología",
      "description": "Atención en reumatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "traumatologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Traumatología",
      "description": "Atención en traumatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "urologia-sanguinetti",
      "hospitalId": "sanguinetti",
      "name": "Urología",
      "description": "Atención en urología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cardiologia-derqui",
      "hospitalId": "derqui",
      "name": "Cardiología",
      "description": "Atención en cardiología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-general-derqui",
      "hospitalId": "derqui",
      "name": "Cirugía General",
      "description": "Atención en cirugía general.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "cirugia-plastica-y-reconstructiva-derqui",
      "hospitalId": "derqui",
      "name": "Cirugía plástica y reconstructiva",
      "description": "Atención en cirugía plástica y reconstructiva.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "dermatologia-derqui",
      "hospitalId": "derqui",
      "name": "Dermatología",
      "description": "Atención en dermatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "diabetologia-derqui",
      "hospitalId": "derqui",
      "name": "Diabetología",
      "description": "Atención en diabetología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "electrofisiologia-derqui",
      "hospitalId": "derqui",
      "name": "Electrofisiología",
      "description": "Atención en electrofisiología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "fonoaudiologia-derqui",
      "hospitalId": "derqui",
      "name": "Fonoaudiología",
      "description": "Atención en fonoaudiología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "gastroenterologia-derqui",
      "hospitalId": "derqui",
      "name": "Gastroenterología",
      "description": "Atención en gastroenterología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "gastroenterologia-infantil-derqui",
      "hospitalId": "derqui",
      "name": "Gastroenterología infantil",
      "description": "Atención en gastroenterología infantil.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "hemoterapia-derqui",
      "hospitalId": "derqui",
      "name": "Hemoterapia",
      "description": "Atención en hemoterapia.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "infectologia-derqui",
      "hospitalId": "derqui",
      "name": "Infectología",
      "description": "Atención en infectología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "kinesiologia-derqui",
      "hospitalId": "derqui",
      "name": "Kinesiología",
      "description": "Atención en kinesiología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "medicina-general-derqui",
      "hospitalId": "derqui",
      "name": "Medicina General",
      "description": "Atención en medicina general.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "nefrologia-derqui",
      "hospitalId": "derqui",
      "name": "Nefrología",
      "description": "Atención en nefrología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neonatologia-derqui",
      "hospitalId": "derqui",
      "name": "Neonatología",
      "description": "Atención en neonatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neumonologia-derqui",
      "hospitalId": "derqui",
      "name": "Neumonología",
      "description": "Atención en neumonología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neumonologia-infantil-derqui",
      "hospitalId": "derqui",
      "name": "Neumonología infantil",
      "description": "Atención en neumonología infantil.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neurocirugia-derqui",
      "hospitalId": "derqui",
      "name": "Neurocirugía",
      "description": "Atención en neurocirugía.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "neurologia-derqui",
      "hospitalId": "derqui",
      "name": "Neurología",
      "description": "Atención en neurología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "nutricion-derqui",
      "hospitalId": "derqui",
      "name": "Nutrición",
      "description": "Atención en nutrición.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "odontologia-derqui",
      "hospitalId": "derqui",
      "name": "Odontología",
      "description": "Atención en odontología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "oncohematologia-derqui",
      "hospitalId": "derqui",
      "name": "Oncohematología",
      "description": "Atención en oncohematología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "otorrinolaringologia-derqui",
      "hospitalId": "derqui",
      "name": "Otorrinolaringología",
      "description": "Atención en otorrinolaringología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psicologia-derqui",
      "hospitalId": "derqui",
      "name": "Psicología",
      "description": "Atención en psicología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psicopedagogia-derqui",
      "hospitalId": "derqui",
      "name": "Psicopedagogía",
      "description": "Atención en psicopedagogía.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "psiquiatria-derqui",
      "hospitalId": "derqui",
      "name": "Psiquiatría",
      "description": "Atención en psiquiatría.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "reumatologia-derqui",
      "hospitalId": "derqui",
      "name": "Reumatología",
      "description": "Atención en reumatología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "traumatologia-infantil-derqui",
      "hospitalId": "derqui",
      "name": "Traumatología Infantil",
      "description": "Atención en traumatología infantil.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "traumatologia-y-ortopedia-derqui",
      "hospitalId": "derqui",
      "name": "Traumatología y ortopedia",
      "description": "Atención en traumatología y ortopedia.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
    },
    {
      "id": "urologia-derqui",
      "hospitalId": "derqui",
      "name": "Urología",
      "description": "Atención en urología.",
      "schedule": {
        "days": [],
        "start": "08:00",
        "end": "13:00",
        "slotMinutes": 30
      }
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
