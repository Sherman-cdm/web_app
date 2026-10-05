# Home.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/patient/home/Home.tsx)

**Ruta:** `src/modules/patient/home/Home.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { ArrowRight, Building2, MapPin, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import type { Hospital, Specialty, View } from '../../../types';
import { SpecialtyCard } from '../specialties/SpecialtyCard';

export default function Home({
  hospitals,
  specialties,
  selectedHospital,
  onHospital,
  onNavigate,
  onBook,
}: {
  hospitals: Hospital[];
  specialties: Specialty[];
  selectedHospital: string;
  onHospital: (id: string) => void;
  onNavigate: (view: View) => void;
  onBook: (hospitalId: string, specialtyId: string) => void;
}) {
  const hospital = hospitals.find((h) => h.id === selectedHospital);
  const availableSpecialties = specialties.filter(
    (s) => s.hospitalId === selectedHospital && s.active !== false,
  );
  const specialtiesHeading = useRef<HTMLHeadingElement>(null);
  function selectHospital(id: string) {
    onHospital(id);
    requestAnimationFrame(() => {
      specialtiesHeading.current?.focus({ preventScroll: true });
      specialtiesHeading.current?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    });
  }
  return (
    <div className="space-y-7">
      <section className="patient-hero relative overflow-hidden rounded-3xl p-6 text-white shadow-lg shadow-teal-900/15 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border-[45px] border-white/5" />
        <div className="relative max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-200">
            <Sparkles size={16} aria-hidden="true" /> MÁS CERCA DE TU SALUD
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Tu salud, a un turno
            <br className="hidden sm:block" /> de distancia.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50/80 sm:text-base">
            Elegí tu hospital, reservá una consulta y encontrá tus estudios en un mismo lugar.
          </p>
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">¿Dónde querés atenderte?</h2>
          <span className="text-xs text-slate-500">3 hospitales</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {hospitals.map((h, index) => (
            <button
              type="button"
              key={h.id}
              aria-pressed={selectedHospital === h.id}
              aria-controls="hospital-specialties"
              onClick={() => selectHospital(h.id)}
              className={`card accent-card ${['tone-teal', 'tone-blue', 'tone-violet'][index % 3]} text-left transition ${selectedHospital === h.id ? 'ring-2 ring-brand-600 ring-offset-2' : ''}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="accent-icon rounded-xl p-3">
                  <Building2 size={23} aria-hidden="true" />
                </span>
                <span
                  className={`h-5 w-5 rounded-full border-2 ${selectedHospital === h.id ? 'border-brand-600 bg-brand-600 ring-4 ring-brand-100' : 'border-slate-300'}`}
                />
              </div>
              <h3 className="font-semibold">{h.name}</h3>
              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={13} aria-hidden="true" />
                {h.area}
              </p>
            </button>
          ))}
        </div>
      </section>
      <section id="hospital-specialties" aria-labelledby="hospital-specialties-title">
        <h2
          ref={specialtiesHeading}
          tabIndex={-1}
          id="hospital-specialties-title"
          className="scroll-mt-28 text-lg font-bold focus:outline-none"
        >
          Especialidades de {hospital?.name}
        </h2>
        <p className="mb-4 mt-2 text-sm text-slate-500" aria-live="polite">
          {availableSpecialties.length} especialidades en {hospital?.shortName}. Elegí una para
          pedir turno.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableSpecialties.map((specialty) => (
            <SpecialtyCard
              key={specialty.id}
              specialty={specialty}
              hospital={hospital}
              onBook={onBook}
            />
          ))}
        </div>
        {!availableSpecialties.length && (
          <p className="card text-sm text-slate-500">
            Este hospital todavía no tiene especialidades publicadas. Podés seleccionar otro
            hospital.
          </p>
        )}
        <button
          type="button"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700"
          onClick={() => onNavigate('specialties')}
        >
          Ver cartelera de todos los hospitales
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>
      <aside className="rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-900">
        <p className="font-semibold">Tu hospital seleccionado: {hospital?.shortName}</p>
        <p className="mt-1 text-brand-700">
          Los hospitales y sus agendas son datos de ejemplo. Esta aplicación no está conectada al
          sistema municipal.
        </p>
      </aside>
    </div>
  );
}
```
