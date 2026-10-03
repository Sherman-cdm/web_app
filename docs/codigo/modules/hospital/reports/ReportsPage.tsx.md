# ReportsPage.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/reports/ReportsPage.tsx)

**Ruta:** `src/modules/hospital/reports/ReportsPage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Download } from 'lucide-react';
import { useState } from 'react';
import { Field } from '../../../shared/components/Field';
import { PageTitle } from '../../../shared/components/PageTitle';
import { exportCsv } from '../../../utils/csv';
import { parseDate, todayISO, toISO } from '../../../utils/date';
import { statusLabels } from '../../../utils/status';
import { useHospital } from '../context/HospitalContext';

export function Reports() {
  const { state, hospitalId } = useHospital();
  const [from, setFrom] = useState(`${todayISO().slice(0, 7)}-01`);
  const [to, setTo] = useState(() => {
    const d = parseDate(todayISO());
    return toISO(new Date(d.getFullYear(), d.getMonth() + 1, 0, 12));
  });
  const appointments = state.appointments.filter(
    (a) => a.hospitalId === hospitalId && a.date >= from && a.date <= to,
  );
  const attended = appointments.filter((a) => a.status === 'completed').length;
  return (
    <>
      <PageTitle
        title="Reportes de atención"
        description="Consultá la actividad por fecha de turno y exportá los datos del hospital."
        action={
          <button
            className="btn-secondary"
            onClick={() =>
              exportCsv('reporte-atencion.csv', [
                ['Desde', 'Hasta', 'Área', 'Turnos', 'Atendidos', 'Cancelados', 'Ausentes'],
                ...state.specialties
                  .filter((s) => s.hospitalId === hospitalId)
                  .map((s) => {
                    const rows = appointments.filter((a) => a.specialtyId === s.id);
                    return [
                      from,
                      to,
                      s.name,
                      rows.length,
                      rows.filter((a) => a.status === 'completed').length,
                      rows.filter((a) => a.status === 'cancelled').length,
                      rows.filter((a) => a.status === 'no_show').length,
                    ];
                  }),
              ])
            }
          >
            <Download size={17} />
            Exportar reporte
          </button>
        }
      />
      <div className="mb-6 grid max-w-lg gap-3 sm:grid-cols-2">
        <Field label="Desde">
          <input
            className="field"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </Field>
        <Field label="Hasta">
          <input
            className="field"
            type="date"
            min={from}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </Field>
      </div>
      {from > to && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          La fecha final debe ser posterior a la inicial.
        </p>
      )}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Turnos registrados', appointments.length],
          ['Consultas atendidas', attended],
          ['Pacientes únicos', new Set(appointments.map((a) => a.patient.dni)).size],
        ].map(([label, value]) => (
          <div className="card" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="card">
          <h2 className="mb-5 text-lg font-bold">Distribución por estado</h2>
          {Object.entries(statusLabels).map(([id, label]) => {
            const count = appointments.filter((a) => a.status === id).length;
            return (
              <div key={id} className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{
                      width: `${appointments.length ? (count / appointments.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>
        <section className="card">
          <h2 className="mb-5 text-lg font-bold">Actividad por área</h2>
          {state.specialties
            .filter((s) => s.hospitalId === hospitalId)
            .map((s) => (
              <div
                key={s.id}
                className="flex justify-between gap-3 border-b border-slate-100 py-4 text-sm"
              >
                <span>{s.name}</span>
                <strong>{appointments.filter((a) => a.specialtyId === s.id).length}</strong>
              </div>
            ))}
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Los totales incluyen todos los estados. Estos indicadores reflejan los registros
            locales, sin métricas de producción hospitalaria.
          </p>
        </section>
      </div>
    </>
  );
}
```
